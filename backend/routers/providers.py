from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from database import get_db
from models import Provider, User, Specialty, Treatment, TreatmentPrice, UserRole, Booking
from schemas import (
    ProviderCreate, ProviderResponse, ProviderUpdate, ProviderDetailResponse,
    ProviderFilter, SpecialtyCreate, SpecialtyResponse, 
    TreatmentResponse, TreatmentPriceCreate, TreatmentPriceResponse, TreatmentPriceUpdate
)
from .auth import get_current_active_user
from sqlalchemy import func, or_, exists

router = APIRouter(
    prefix="/providers",
    tags=["Providers"],
    responses={404: {"description": "Not found"}},
)

# Providers endpoints
@router.post("/", response_model=ProviderResponse, status_code=status.HTTP_201_CREATED)
def create_provider(
    provider: ProviderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if user is authorized to create a provider
    if current_user.role not in [UserRole.ADMIN, UserRole.PROVIDER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create provider profiles"
        )
    
    # Check if provider already exists for this user
    existing_provider = db.query(Provider).filter(Provider.user_id == provider.user_id).first()
    if existing_provider:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provider profile already exists for this user"
        )
    
    # Create new provider
    db_provider = Provider(
        user_id=provider.user_id,
        name=provider.name,
        description=provider.description,
        address=provider.address,
        city=provider.city,
        country=provider.country,
        phone=provider.phone,
        website=provider.website,
        license_number=provider.license_number
    )
    
    # Add specialties
    specialties = db.query(Specialty).filter(Specialty.id.in_(provider.specialty_ids)).all()
    if len(specialties) != len(provider.specialty_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more specialty IDs are invalid"
        )
    db_provider.specialties = specialties
    
    # Add treatments
    treatments = db.query(Treatment).filter(Treatment.id.in_(provider.treatment_ids)).all()
    if len(treatments) != len(provider.treatment_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more treatment IDs are invalid"
        )
    db_provider.treatments = treatments
    
    db.add(db_provider)
    db.commit()
    db.refresh(db_provider)
    return db_provider

@router.get("/", response_model=List[ProviderResponse])
def get_providers(
    filter: ProviderFilter = Depends(),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Provider)
    
    # Apply filters
    if filter.country:
        query = query.filter(Provider.country == filter.country)
    if filter.city:
        query = query.filter(Provider.city == filter.city)
    if filter.featured:
        query = query.filter(Provider.featured == True)
    if filter.min_rating is not None:
        query = query.filter(Provider.average_rating >= filter.min_rating)
    if filter.treatment_id:
        query = query.filter(Provider.treatments.any(Treatment.id == filter.treatment_id))
    if filter.specialty_id:
        query = query.filter(Provider.specialties.any(Specialty.id == filter.specialty_id))
    if filter.search:
        search_term = f"%{filter.search}%"
        query = query.filter(
            or_(
                Provider.name.ilike(search_term),
                Provider.description.ilike(search_term),
                Provider.city.ilike(search_term),
                Provider.country.ilike(search_term)
            )
        )
    
    # Return filtered results
    providers = query.offset(skip).limit(limit).all()
    return providers

@router.get("/{provider_id}", response_model=ProviderDetailResponse)
def get_provider(provider_id: int, db: Session = Depends(get_db)):
    provider = db.query(Provider).options(
        joinedload(Provider.specialties),
        joinedload(Provider.treatments).joinedload(Treatment.treatment_prices)
    ).filter(Provider.id == provider_id).first()

    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")

    # Collect treatment_prices from all treatments associated with the provider.
    treatment_prices = []
    for treatment in provider.treatments:
        for price in treatment.treatment_prices:
            if price.provider_id == provider.id:
                treatment_prices.append(price)

    # Build the response manually with proper Pydantic conversion
    return ProviderDetailResponse(
        id=provider.id,
        user_id=provider.user_id,
        name=provider.name,
        description=provider.description,
        address=provider.address,
        city=provider.city,
        country=provider.country,
        phone=provider.phone,
        website=provider.website,
        license_number=provider.license_number,
        is_verified=provider.is_verified,
        created_at=provider.created_at,
        updated_at=provider.updated_at,
        average_rating=provider.average_rating,
        total_reviews=provider.total_reviews,
        featured=provider.featured,
        specialties=[SpecialtyResponse.from_orm(s) for s in provider.specialties],
        treatments=[TreatmentResponse.from_orm(t) for t in provider.treatments],
        treatment_prices=[TreatmentPriceResponse.from_orm(p) for p in treatment_prices]
    )

@router.put("/{provider_id}", response_model=ProviderResponse)
def update_provider(
    provider_id: int,
    provider_update: ProviderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get provider
    provider = db.query(Provider).filter(Provider.id == provider_id).first()
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found"
        )
    
    # Check authorization
    if current_user.id != provider.user_id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this provider"
        )
    
    # Update basic fields
    update_data = provider_update.dict(exclude_unset=True)
    
    # Handle specialty and treatment updates separately
    specialties = update_data.pop("specialty_ids", None)
    treatments = update_data.pop("treatment_ids", None)
    
    for key, value in update_data.items():
        setattr(provider, key, value)
    
    # Update specialties if provided
    if specialties is not None:
        specialty_objs = db.query(Specialty).filter(Specialty.id.in_(specialties)).all()
        if len(specialty_objs) != len(specialties):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more specialty IDs are invalid"
            )
        provider.specialties = specialty_objs
    
    # Update treatments if provided
    if treatments is not None:
        treatment_objs = db.query(Treatment).filter(Treatment.id.in_(treatments)).all()
        if len(treatment_objs) != len(treatments):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more treatment IDs are invalid"
            )
        provider.treatments = treatment_objs
    
    db.commit()
    db.refresh(provider)
    return provider

# Specialties endpoints
@router.post("/specialties/", response_model=SpecialtyResponse, status_code=status.HTTP_201_CREATED)
def create_specialty(
    specialty: SpecialtyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Only admin can create specialties
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can create specialties"
        )
    
    # Check if specialty already exists
    existing = db.query(Specialty).filter(Specialty.name == specialty.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Specialty already exists"
        )
    
    # Create specialty
    db_specialty = Specialty(**specialty.dict())
    db.add(db_specialty)
    db.commit()
    db.refresh(db_specialty)
    return db_specialty

@router.get("/specialties/", response_model=List[SpecialtyResponse])
def get_specialties(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    specialties = db.query(Specialty).offset(skip).limit(limit).all()
    return specialties

@router.get("/treatments/", response_model=List[TreatmentResponse])
def get_treatments(
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Treatment)
    if category:
        query = query.filter(Treatment.category == category)
    treatments = query.offset(skip).limit(limit).all()
    return treatments

# Treatment Price endpoints
@router.post("/treatment-prices/", response_model=TreatmentPriceResponse, status_code=status.HTTP_201_CREATED)
def create_treatment_price(
    treatment_price: TreatmentPriceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if provider exists and current user is authorized
    provider = db.query(Provider).filter(Provider.id == treatment_price.provider_id).first()
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found"
        )
    
    if current_user.id != provider.user_id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to add treatment prices for this provider"
        )
    
    # Check if treatment exists
    treatment = db.query(Treatment).filter(Treatment.id == treatment_price.treatment_id).first()
    if not treatment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Treatment not found"
        )
    
    # Create treatment price
    db_treatment_price = TreatmentPrice(**treatment_price.dict())
    db.add(db_treatment_price)
    db.commit()
    db.refresh(db_treatment_price)
    return db_treatment_price

@router.put("/treatment-prices/{price_id}", response_model=TreatmentPriceResponse)
def update_treatment_price(
    price_id: int,
    updated_price: TreatmentPriceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_price = db.query(TreatmentPrice).options(joinedload(TreatmentPrice.treatment)).filter(TreatmentPrice.id == price_id).first()
    if not db_price:
        raise HTTPException(status_code=404, detail="Treatment price not found")

    provider = db.query(Provider).filter(Provider.id == db_price.provider_id).first()
    if not provider or provider.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if updated_price.treatment_id and updated_price.treatment_id != db_price.treatment_id:
        # Check if this treatment_price is used in any bookings
        is_used = db.query(exists().where(Booking.treatment_price_id == db_price.id)).scalar()
        if is_used:
            raise HTTPException(
                status_code=400,
                detail="Cannot update treatment_id of a treatment price that is referenced in bookings."
            )

    for field, value in updated_price.dict(exclude_unset=True).items():
        setattr(db_price, field, value)

    db.commit()
    db.refresh(db_price)
    return db_price

@router.delete("/treatment-prices/{price_id}", status_code=204)
def delete_treatment_price(
    price_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_price = db.query(TreatmentPrice).filter(TreatmentPrice.id == price_id).first()
    if not db_price:
        raise HTTPException(status_code=404, detail="Treatment price not found")

    provider = db.query(Provider).filter(Provider.id == db_price.provider_id).first()
    if not provider or provider.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Check if referenced by bookings
    is_used = db.query(exists().where(Booking.treatment_price_id == db_price.id)).scalar()
    if is_used:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete treatment price that is referenced by existing bookings."
        )

    db.delete(db_price)
    db.commit()