from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User, UserRole
from schemas import UserUpdate, UserResponse
from .auth import get_current_active_user, get_password_hash

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    responses={404: {"description": "Not found"}},
)

@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if user is authorized to view user details
    if current_user.id != user_id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this user's details"
        )
    
    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@router.put("/me", response_model=UserResponse)
def update_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Update user data
    update_data = user_update.dict(exclude_unset=True)
    
    # Hash password if it's being updated
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    # Apply updates
    for key, value in update_data.items():
        setattr(current_user, key, value)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.get("/me/stripe", response_model=dict)
def get_stripe_info(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Return user's Stripe customer ID
    return {"stripe_customer_id": current_user.stripe_customer_id}

@router.put("/me/stripe", response_model=dict)
def update_stripe_info(
    stripe_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Update user's Stripe customer ID
    if "stripe_customer_id" in stripe_data:
        current_user.stripe_customer_id = stripe_data["stripe_customer_id"]
        db.commit()
        db.refresh(current_user)
    
    return {"stripe_customer_id": current_user.stripe_customer_id}
