from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from models import Treatment, User, Provider, Booking, BookingStatus, TreatmentPrice
from schemas import TreatmentResponse, ProviderResponse, UserTreatmentResponse, UserTreatmentEntry
from database import get_db
from .auth import get_current_active_user

router = APIRouter(
    prefix="/treatments",
    tags=["treatments"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[TreatmentResponse]) # GET all treatments
def get_all_treatments(db: Session = Depends(get_db)):
    treatments = db.query(Treatment).all()
    return treatments

# Get a treatment by ID, including providers offering it
@router.get("/{treatment_id}", response_model=TreatmentResponse)
def get_treatment(treatment_id: int, db: Session = Depends(get_db)):
    treatment = db.query(Treatment).filter(Treatment.id == treatment_id).first()
    if not treatment:
        raise HTTPException(status_code=404, detail="Treatment not found")
    return treatment


@router.get("/{treatment_id}/providers", response_model=List[ProviderResponse])
def get_treatment_providers(treatment_id: int, db: Session = Depends(get_db)):
    treatment = db.query(Treatment).filter(Treatment.id == treatment_id).first()
    if not treatment:
        raise HTTPException(status_code=404, detail="Treatment not found")
    return treatment.providers

@router.get("/user-treatments/{provider_id}", response_model=UserTreatmentResponse)
def get_user_completed_treatments(
    provider_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get list of treatments the current user has completed with a specific provider"""

    provider = db.query(Provider).filter(Provider.id == provider_id).first()
    if not provider:
        raise HTTPException(
            status_code=404,
            detail="Provider not found"
        )

    completed_bookings = db.query(Booking).filter(
        Booking.user_id == current_user.id,
        Booking.provider_id == provider_id,
        Booking.status == BookingStatus.COMPLETED
    ).all()

    if not completed_bookings:
        raise HTTPException(
            status_code=403,
            detail="You have no completed treatments with this provider"
        )

    seen_treatments = set()
    treatments: List[UserTreatmentEntry] = []

    for booking in completed_bookings:
        treatment_price = db.query(TreatmentPrice).filter(
            TreatmentPrice.id == booking.treatment_price_id
        ).first()

        if treatment_price and treatment_price.treatment:
            treatment = treatment_price.treatment
            if treatment.id not in seen_treatments:
                treatments.append(UserTreatmentEntry(
                    id=treatment.id,
                    name=treatment.name,
                    booking_date=booking.appointment_date
                ))
                seen_treatments.add(treatment.id)

    return UserTreatmentResponse(
        treatments=treatments,
        can_review=True
    )

# No POST, PUT, DELETE of treatments. Managed by database admin only.