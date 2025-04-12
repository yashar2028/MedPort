from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Table, Text, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base

# Enums
class UserRole(str, enum.Enum):
    USER = "user"
    PROVIDER = "provider"
    ADMIN = "admin"

class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    REFUNDED = "refunded"
    FAILED = "failed"

# Join tables
provider_specialties = Table(
    "provider_specialties",
    Base.metadata,
    Column("provider_id", Integer, ForeignKey("providers.id"), primary_key=True),
    Column("specialty_id", Integer, ForeignKey("specialties.id"), primary_key=True)
)

provider_treatments = Table(
    "provider_treatments",
    Base.metadata,
    Column("provider_id", Integer, ForeignKey("providers.id"), primary_key=True),
    Column("treatment_id", Integer, ForeignKey("treatments.id"), primary_key=True)
)

# Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.USER)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    stripe_customer_id = Column(String, nullable=True)

    # Relationships
    reviews = relationship("Review", back_populates="user")
    bookings = relationship("Booking", back_populates="user")
    provider = relationship("Provider", back_populates="user", uselist=False)

class Provider(Base):
    __tablename__ = "providers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    name = Column(String, index=True)
    description = Column(Text)
    address = Column(String)
    city = Column(String)
    country = Column(String, index=True)
    phone = Column(String)
    website = Column(String, nullable=True)
    license_number = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    average_rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    featured = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="provider")
    treatments = relationship("Treatment", secondary=provider_treatments, back_populates="providers")
    specialties = relationship("Specialty", secondary=provider_specialties, back_populates="providers")
    reviews = relationship("Review", back_populates="provider")
    bookings = relationship("Booking", back_populates="provider")

class Specialty(Base):
    __tablename__ = "specialties"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)

    # Relationships
    providers = relationship("Provider", secondary=provider_specialties, back_populates="specialties")

class Treatment(Base):
    __tablename__ = "treatments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    category = Column(String, index=True)
    average_duration = Column(String, nullable=True)
    recovery_time = Column(String, nullable=True)

    # Relationships
    providers = relationship("Provider", secondary=provider_treatments, back_populates="treatments")
    treatment_prices = relationship("TreatmentPrice", back_populates="treatment")

class TreatmentPrice(Base):
    __tablename__ = "treatment_prices"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("providers.id"))
    treatment_id = Column(Integer, ForeignKey("treatments.id"))
    price = Column(Float)
    currency = Column(String, default="USD")
    description = Column(Text, nullable=True)

    # Relationships
    treatment = relationship("Treatment", back_populates="treatment_prices")
    provider = relationship("Provider")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    provider_id = Column(Integer, ForeignKey("providers.id"))
    rating = Column(Integer)  # 1-5 stars
    comment = Column(Text, nullable=True)
    treatment_received = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    verified_booking = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="reviews")
    provider = relationship("Provider", back_populates="reviews")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    provider_id = Column(Integer, ForeignKey("providers.id"))
    treatment_price_id = Column(Integer, ForeignKey("treatment_prices.id"))
    appointment_date = Column(DateTime(timezone=True))
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING)
    special_requests = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="bookings")
    provider = relationship("Provider", back_populates="bookings")
    treatment_price = relationship("TreatmentPrice")
    payment = relationship("Payment", back_populates="booking", uselist=False)

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), unique=True)
    amount = Column(Float)
    currency = Column(String, default="USD")
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    stripe_payment_intent_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    booking = relationship("Booking", back_populates="payment")
