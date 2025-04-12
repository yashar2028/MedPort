from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from database import get_db
from models import Payment, Booking, BookingStatus, PaymentStatus, User
from schemas import PaymentIntentCreate, PaymentIntentResponse
from .auth import get_current_active_user
import uuid
import os

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
    responses={404: {"description": "Not found"}},
)

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
    
    # Check if there's already a payment for this booking
    existing_payment = db.query(Payment).filter(Payment.booking_id == booking.id).first()
    if existing_payment and existing_payment.status == PaymentStatus.PAID:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This booking has already been paid for"
        )
    
    # Get treatment price
    treatment_price = booking.treatment_price
    
    # Create a mock payment intent ID
    mock_payment_intent_id = f"pi_{uuid.uuid4().hex}"
    # Create a mock client secret (in real app this would come from Stripe)
    mock_client_secret = f"pi_mock_{uuid.uuid4().hex}_secret_{uuid.uuid4().hex[:8]}"
    
    # Create or update payment record
    if existing_payment:
        existing_payment.amount = treatment_price.price
        existing_payment.currency = treatment_price.currency
        existing_payment.status = PaymentStatus.PENDING
        existing_payment.stripe_payment_intent_id = mock_payment_intent_id
        db.commit()
    else:
        new_payment = Payment(
            booking_id=booking.id,
            amount=treatment_price.price,
            currency=treatment_price.currency,
            stripe_payment_intent_id=mock_payment_intent_id
        )
        db.add(new_payment)
        db.commit()
    
    return {"client_secret": mock_client_secret}

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
