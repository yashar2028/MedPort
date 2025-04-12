from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Review, Provider, Booking, BookingStatus, User
from schemas import ReviewCreate, ReviewResponse, ReviewUpdate
from .auth import get_current_active_user
from sqlalchemy import func

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if provider exists
    provider = db.query(Provider).filter(Provider.id == review.provider_id).first()
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found"
        )
    
    # Check if user has already reviewed this provider
    existing_review = db.query(Review).filter(
        Review.user_id == current_user.id,
        Review.provider_id == review.provider_id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this provider"
        )
    
    # Check if user has a completed booking with this provider for verification
    verified_booking = db.query(Booking).filter(
        Booking.user_id == current_user.id,
        Booking.provider_id == review.provider_id,
        Booking.status == BookingStatus.COMPLETED
    ).first()
    
    # Create review
    db_review = Review(
        user_id=current_user.id,
        provider_id=review.provider_id,
        rating=review.rating,
        comment=review.comment,
        treatment_received=review.treatment_received,
        verified_booking=bool(verified_booking)
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Update provider average rating
    update_provider_rating(db, review.provider_id)
    
    return db_review

@router.get("/provider/{provider_id}", response_model=List[ReviewResponse])
def get_provider_reviews(
    provider_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    # Check if provider exists
    provider = db.query(Provider).filter(Provider.id == provider_id).first()
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found"
        )
    
    # Get reviews for provider
    reviews = db.query(Review).filter(
        Review.provider_id == provider_id
    ).order_by(Review.created_at.desc()).offset(skip).limit(limit).all()
    
    return reviews

@router.get("/user", response_model=List[ReviewResponse])
def get_user_reviews(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get reviews by current user
    reviews = db.query(Review).filter(
        Review.user_id == current_user.id
    ).order_by(Review.created_at.desc()).offset(skip).limit(limit).all()
    
    return reviews

@router.put("/{review_id}", response_model=ReviewResponse)
def update_review(
    review_id: int,
    review_update: ReviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get review
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    # Check if user is the author of the review
    if db_review.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this review"
        )
    
    # Update review
    update_data = review_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_review, key, value)
    
    db.commit()
    db.refresh(db_review)
    
    # Update provider average rating if rating changed
    if "rating" in update_data:
        update_provider_rating(db, db_review.provider_id)
    
    return db_review

@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get review
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    # Check if user is the author of the review
    if db_review.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this review"
        )
    
    provider_id = db_review.provider_id
    
    # Delete review
    db.delete(db_review)
    db.commit()
    
    # Update provider average rating
    update_provider_rating(db, provider_id)
    
    return None

# Helper function to update provider average rating
def update_provider_rating(db: Session, provider_id: int):
    # Calculate new average rating
    result = db.query(func.avg(Review.rating).label("average"), func.count(Review.id).label("count"))\
               .filter(Review.provider_id == provider_id).first()
    
    average_rating = result.average or 0.0
    total_reviews = result.count or 0
    
    # Update provider
    provider = db.query(Provider).filter(Provider.id == provider_id).first()
    if provider:
        provider.average_rating = average_rating
        provider.total_reviews = total_reviews
        db.commit()
