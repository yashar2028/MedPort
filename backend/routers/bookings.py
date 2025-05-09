from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from datetime import datetime, timedelta, timezone
from database import get_db
from models import Booking, TreatmentPrice, Provider, UserRole, BookingStatus, User
from schemas import BookingCreate, BookingResponse, BookingUpdate, ProviderResponse, TreatmentPriceResponse, UserResponse
from .auth import get_current_active_user

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if provider exists
    provider = db.query(Provider).filter(Provider.id == booking.provider_id).first()
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found"
        )
    
    # Check if treatment price exists
    treatment_price = db.query(TreatmentPrice).filter(
        TreatmentPrice.id == booking.treatment_price_id,
        TreatmentPrice.provider_id == booking.provider_id
    ).first()
    
    if not treatment_price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Treatment price not found for this provider"
        )
    
    # Validate appointment date
    if booking.appointment_date < datetime.now(timezone.utc) + timedelta(days=1):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment date must be at least 24 hours in the future"
        )
    
    # Create booking
    db_booking = Booking(
        user_id=current_user.id,
        provider_id=booking.provider_id,
        treatment_price_id=booking.treatment_price_id,
        appointment_date=booking.appointment_date,
        special_requests=booking.special_requests
    )
    
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    
    return db_booking

@router.get("/", response_model=List[BookingResponse])
def get_user_bookings(
    booking_status: BookingStatus = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get bookings for current user
    query = db.query(Booking).options(
        joinedload(Booking.user),  # include user
        joinedload(Booking.provider),
        joinedload(Booking.treatment_price).joinedload(TreatmentPrice.treatment)
    ).filter(Booking.user_id == current_user.id)
    
    if booking_status:
        query = query.filter(Booking.status == booking_status)
    
    bookings = query.order_by(Booking.appointment_date).all()
    return bookings

@router.get("/provider", response_model=List[BookingResponse])
def get_provider_bookings(
    booking_status: BookingStatus = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get provider for current user
    provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
    
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not a provider"
        )
    
    # Collect treatment_prices from all treatments associated with the provider.
    treatment_prices = []
    for treatment in provider.treatments:
        for price in treatment.treatment_prices:
            if price.provider_id == provider.id:
                treatment_prices.append(price)
    
    # Get bookings for provider
    query = db.query(Booking).options(
        joinedload(Booking.user),  # include user
        joinedload(Booking.provider),
        joinedload(Booking.treatment_price).joinedload(TreatmentPrice.treatment)
    ).filter(Booking.provider_id == provider.id)
    
    if booking_status:
        query = query.filter(Booking.status == booking_status)
    
    bookings = query.order_by(Booking.appointment_date).all()

    # Manually build the response (since it includes nested lists, this is necessary (same as @router.get("/{provider_id} route)).
    result = []
    for booking in bookings:
        # Fetch the provider and treatment_price for the current booking
        provider_response = ProviderResponse.from_orm(booking.provider)
        treatment_price_response = TreatmentPriceResponse.from_orm(booking.treatment_price)
        user_response = UserResponse.from_orm(booking.user) 

        result.append(BookingResponse(
            id=booking.id,
            user_id=booking.user_id,
            provider_id=booking.provider_id,
            treatment_price_id=booking.treatment_price_id,
            appointment_date=booking.appointment_date,
            special_requests=booking.special_requests,
            status=booking.status,
            created_at=booking.created_at,
            updated_at=booking.updated_at,
            provider=provider_response,
            treatment_price=treatment_price_response,
            user=user_response
        ))

    return result


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
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
    
    # Check if user is authorized to view this booking
    provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
    is_provider_of_booking = provider and provider.id == booking.provider_id
    
    if booking.user_id != current_user.id and not is_provider_of_booking and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this booking"
        )
    
    return booking

@router.put("/{booking_id}", response_model=BookingResponse)
def update_booking(
    booking_id: int,
    booking_update: BookingUpdate,
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
    
    # Check if user is authorized to update this booking
    provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
    is_provider_of_booking = provider and provider.id == booking.provider_id
    
    # Users can update their own bookings, providers can update status
    if booking.user_id != current_user.id and not is_provider_of_booking and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this booking"
        )
    
    # Apply updates based on role
    update_data = booking_update.dict(exclude_unset=True)
    
    # Only provider or admin can update status
    if "status" in update_data and booking.user_id == current_user.id and current_user.role != UserRole.ADMIN:
        if not is_provider_of_booking:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only providers or admin can update booking status"
            )
    
    # Validate appointment date if being updated
    if "appointment_date" in update_data:
        if update_data["appointment_date"] < datetime.now() + timedelta(days=1):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Appointment date must be at least 24 hours in the future"
            )
        
        # Check if booking can still be rescheduled
        if booking.status not in [BookingStatus.PENDING, BookingStatus.CONFIRMED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot reschedule booking with status {booking.status}"
            )
    
    # Apply updates
    for key, value in update_data.items():
        setattr(booking, key, value)
    
    db.commit()
    db.refresh(booking)
    
    return booking

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_booking(
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
    
    # Check if user is authorized to cancel this booking
    if booking.user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to cancel this booking"
        )
    
    # Check if booking can be cancelled
    if booking.status in [BookingStatus.COMPLETED, BookingStatus.CANCELLED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel booking with status {booking.status}"
        )
    
    # Update booking status to cancelled
    booking.status = BookingStatus.CANCELLED
    db.commit()
    
    return None
