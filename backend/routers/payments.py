from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from database import get_db
from models import Payment, Booking, BookingStatus, PaymentStatus, User
from schemas import PaymentIntentCreate, PaymentIntentResponse
from .auth import get_current_active_user
from dotenv import load_dotenv
import os
import stripe
import logging

load_dotenv()

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
    responses={404: {"description": "Not found"}},
)
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@router.post("/create-payment-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(
    payment_data: PaymentIntentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get booking
    booking = db.query(Booking).filter(Booking.id == payment_data.booking_id).first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Check if user is authorized to pay for this booking
    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to pay for this booking"
        )
    
    # Check if booking is in a valid state for payment
    if booking.status != BookingStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot process payment for booking with status {booking.status}"
        )
    
    if not stripe.api_key:
        logging.error("Stripe secret key is not set!")
        raise HTTPException(status_code=500, detail="Payment configuration error")
    
    # Check if there's already a payment for this booking
    existing_payment = db.query(Payment).filter(Payment.booking_id == booking.id).first()
    if existing_payment and existing_payment.status == PaymentStatus.PAID:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This booking has already been paid for"
        )
    
    # Get treatment price
    treatment_price = booking.treatment_price
    
    amount = treatment_price.price
    currency = treatment_price.currency

    try:
        intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),  # Convert to cents
            currency=currency,
            metadata={
                "booking_id": str(booking.id),
                "user_id": str(current_user.id)
            }
        )
    except stripe.error.StripeError as e:
        logging.error(f"Stripe error: {e.user_message}")
        raise HTTPException(status_code=500, detail=f"Stripe error: {e.user_message}")
    except Exception as e:
        logging.error(f"Unexpected error during Stripe PaymentIntent creation: {e}")
        raise HTTPException(status_code=500, detail="Unexpected error during payment processing")
    
    # Create or update payment record
    if existing_payment:
        existing_payment.amount = amount
        existing_payment.currency = currency
        existing_payment.status = PaymentStatus.PENDING
        existing_payment.stripe_payment_intent_id = intent.id
        db.commit()
    else:
        new_payment = Payment(
            booking_id=booking.id,
            amount=amount,
            currency=currency,
            stripe_payment_intent_id=intent.id,
            status=PaymentStatus.PENDING
        )
        db.add(new_payment)
        db.commit()
    
    return {"client_secret": intent.client_secret}

@router.post("/confirm-payment/{booking_id}", status_code=status.HTTP_200_OK)
async def confirm_payment(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get booking
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Check if user is authorized
    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized for this booking"
        )
    
    # Get payment
    payment = db.query(Payment).filter(Payment.booking_id == booking_id).first()
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    # Update payment status
    payment.status = PaymentStatus.PAID
    
    # Update booking status
    booking.status = BookingStatus.CONFIRMED
    
    db.commit()
    
    return {"status": "Payment confirmed", "booking_status": booking.status}
