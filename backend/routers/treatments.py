from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from models import Treatment
from schemas import TreatmentResponse, ProviderResponse
from database import get_db

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


# No POST, PUT, DELETE of treatments. Managed by database admin only.