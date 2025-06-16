from pydantic import BaseModel, EmailStr, validator, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from models import UserRole, BookingStatus, PaymentStatus

# User schemas (the forms seriallized into a simple pydantic class (has to match the submitted form with name attributes from frontend)).
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    role: Optional[UserRole] = UserRole.USER

class UserCreate(UserBase):
    password: str

    @validator('password')
    def password_validation(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    is_active: bool

    class Config:
        orm_mode = True # To convert SQLAlchemy models to Pydantic (this is for all classes that are classified as response and are used in endpoints as response model).
        from_attributes=True

# Provider schemas
class ProviderBase(BaseModel):
    name: str
    description: str
    address: str
    city: str
    country: str
    phone: str
    website: Optional[str] = None
    license_number: Optional[str] = None

class ProviderCreate(ProviderBase):
    user_id: int
    specialty_ids: List[int]
    treatment_ids: List[int]

class ProviderUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    license_number: Optional[str] = None
    specialty_ids: Optional[List[int]] = None
    treatment_ids: Optional[List[int]] = None
    is_verified: Optional[bool] = None
    featured: Optional[bool] = None

class SpecialtyBase(BaseModel):
    name: str
    description: Optional[str] = None

class SpecialtyCreate(SpecialtyBase):
    pass

class SpecialtyResponse(SpecialtyBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True

class TreatmentBase(BaseModel):
    name: str
    description: str
    category: str
    average_duration: Optional[str] = None
    recovery_time: Optional[str] = None

class TreatmentCreate(TreatmentBase):
    pass

class TreatmentResponse(TreatmentBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True

class TreatmentPriceBase(BaseModel):
    treatment_id: int
    price: float
    currency: str = "USD"
    description: Optional[str] = None

class TreatmentPriceCreate(TreatmentPriceBase):
    provider_id: int

class TreatmentPriceResponse(TreatmentPriceBase):
    id: int
    treatment: TreatmentResponse

    class Config:
        orm_mode = True
        from_attributes = True

class ProviderResponse(ProviderBase):
    id: int
    user_id: int
    is_verified: bool
    average_rating: float
    total_reviews: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    featured: bool
    specialties: List[SpecialtyResponse]
    treatments: List[TreatmentResponse]

    class Config:
        orm_mode = True
        from_attributes=True

class ProviderDetailResponse(ProviderResponse):
    treatment_prices: List[TreatmentPriceResponse]

    class Config:
        orm_mode = True
        from_attributes = True

# Review schemas
class ReviewBase(BaseModel):
    provider_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    treatment_received: Optional[str] = None
    site_quality: Optional[int] = Field(None, ge=1, le=5)
    transportation: Optional[int] = Field(None, ge=1, le=5)
    accommodation: Optional[int] = Field(None, ge=1, le=5)

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    comment: Optional[str] = None
    treatment_received: Optional[str] = None
    site_quality: Optional[int] = Field(None, ge=1, le=5)
    transportation: Optional[int] = Field(None, ge=1, le=5)
    accommodation: Optional[int] = Field(None, ge=1, le=5)

class ReviewResponse(ReviewBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    verified_booking: bool
    user: UserResponse

    class Config:
        orm_mode = True

# Booking schemas
class BookingBase(BaseModel):
    provider_id: int
    treatment_price_id: int
    appointment_date: datetime
    special_requests: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    appointment_date: Optional[datetime] = None
    status: Optional[BookingStatus] = None
    special_requests: Optional[str] = None

class BookingResponse(BookingBase):
    id: int
    user_id: int
    status: BookingStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    provider: ProviderResponse
    treatment_price: TreatmentPriceResponse
    user: UserResponse

    class Config:
        orm_mode = True
        from_attributes = True

# Payment schemas
class PaymentBase(BaseModel):
    booking_id: int
    amount: float
    currency: str = "USD"

class PaymentCreate(PaymentBase):
    pass

class PaymentResponse(PaymentBase):
    id: int
    status: PaymentStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class PaymentIntentCreate(BaseModel):
    booking_id: int

class PaymentIntentResponse(BaseModel):
    client_secret: str

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None

# Search and filter schemas
class ProviderFilter(BaseModel):
    country: Optional[str] = None
    city: Optional[str] = None
    treatment_id: Optional[int] = None
    specialty_id: Optional[int] = None
    min_rating: Optional[float] = None
    featured: Optional[bool] = None
    search: Optional[str] = None

class ComparisonRequest(BaseModel):
    provider_ids: List[int]
    treatment_id: Optional[int] = None

# Schemas for user treatment in order to make a review
class UserTreatmentEntry(BaseModel):
    id: int
    name: str
    booking_date: datetime


class UserTreatmentResponse(BaseModel):
    treatments: List[UserTreatmentEntry]
    can_review: bool