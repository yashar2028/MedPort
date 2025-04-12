from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, Provider, Specialty, Treatment, TreatmentPrice, UserRole
from passlib.context import CryptContext
import datetime

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_sample_data():
    db = SessionLocal()
    try:
        # Only add sample data if database is empty
        if db.query(User).count() > 0:
            print("Database already contains data. Skipping sample data creation.")
            return

        print("Creating sample data...")
        
        # Create admin user
        admin_user = User(
            email="admin@medport.com",
            username="admin",
            hashed_password=pwd_context.hash("admin123"),
            full_name="Admin User",
            role=UserRole.ADMIN
        )
        db.add(admin_user)
        
        # Create patient users
        patient1 = User(
            email="john@example.com",
            username="john_doe",
            hashed_password=pwd_context.hash("password123"),
            full_name="John Doe",
            role=UserRole.USER
        )
        db.add(patient1)
        
        patient2 = User(
            email="sarah@example.com",
            username="sarah_smith",
            hashed_password=pwd_context.hash("password123"),
            full_name="Sarah Smith",
            role=UserRole.USER
        )
        db.add(patient2)
        
        # Create provider users
        provider_user1 = User(
            email="dr.mitchell@healthclinic.com",
            username="dr_mitchell",
            hashed_password=pwd_context.hash("provider123"),
            full_name="Dr. Robert Mitchell",
            role=UserRole.PROVIDER
        )
        db.add(provider_user1)
        
        provider_user2 = User(
            email="dr.chen@beautyclinic.com",
            username="dr_chen",
            hashed_password=pwd_context.hash("provider123"),
            full_name="Dr. Lily Chen",
            role=UserRole.PROVIDER
        )
        db.add(provider_user2)
        
        provider_user3 = User(
            email="dr.garcia@dentalclinic.com",
            username="dr_garcia",
            hashed_password=pwd_context.hash("provider123"),
            full_name="Dr. Carlos Garcia",
            role=UserRole.PROVIDER
        )
        db.add(provider_user3)
        
        # Commit to get IDs
        db.commit()
        
        # Create specialties
        plastic_surgery = Specialty(
            name="Plastic Surgery",
            description="Cosmetic and reconstructive procedures to alter appearance"
        )
        db.add(plastic_surgery)
        
        dental = Specialty(
            name="Dental Care",
            description="Procedures related to teeth and gums"
        )
        db.add(dental)
        
        dermatology = Specialty(
            name="Dermatology",
            description="Skin treatments and procedures"
        )
        db.add(dermatology)
        
        hair_restoration = Specialty(
            name="Hair Restoration",
            description="Hair implants and treatments for hair loss"
        )
        db.add(hair_restoration)
        
        wellness = Specialty(
            name="Wellness & Spa",
            description="Non-surgical wellness and rejuvenation treatments"
        )
        db.add(wellness)
        
        # Commit to get IDs
        db.commit()
        
        # Create treatments
        treatments = [
            Treatment(
                name="Hair Transplant",
                description="FUE (Follicular Unit Extraction) hair transplant procedure",
                category="Hair Restoration",
                average_duration="6-8 hours",
                recovery_time="1-2 weeks"
            ),
            Treatment(
                name="Dental Implants",
                description="Artificial tooth roots to support replacement teeth",
                category="Dental",
                average_duration="1-2 hours per implant",
                recovery_time="3-6 months"
            ),
            Treatment(
                name="Rhinoplasty",
                description="Surgical procedure to reshape the nose",
                category="Plastic Surgery",
                average_duration="2-3 hours",
                recovery_time="1-2 weeks"
            ),
            Treatment(
                name="Botox Injection",
                description="Injection to reduce fine lines and wrinkles",
                category="Cosmetic",
                average_duration="30 minutes",
                recovery_time="No downtime"
            ),
            Treatment(
                name="Liposuction",
                description="Surgical removal of fat deposits",
                category="Plastic Surgery",
                average_duration="1-4 hours",
                recovery_time="2-4 weeks"
            ),
            Treatment(
                name="Teeth Whitening",
                description="Professional procedure to whiten teeth",
                category="Dental",
                average_duration="1-2 hours",
                recovery_time="No downtime"
            ),
            Treatment(
                name="Laser Skin Resurfacing",
                description="Treatment to improve skin texture and appearance",
                category="Dermatology",
                average_duration="30-60 minutes",
                recovery_time="3-10 days"
            )
        ]
        
        for treatment in treatments:
            db.add(treatment)
        
        # Commit to get IDs
        db.commit()
        
        # Create providers
        provider1 = Provider(
            user_id=provider_user1.id,
            name="HealthCare Clinic Istanbul",
            description="Premier clinic specializing in hair transplants and cosmetic procedures in the heart of Istanbul.",
            address="123 Medical Boulevard",
            city="Istanbul",
            country="Turkey",
            phone="+90 555 123 4567",
            website="www.healthcareclinic.com",
            license_number="MED12345",
            is_verified=True,
            featured=True,
            average_rating=4.7,
            total_reviews=28
        )
        db.add(provider1)
        
        provider2 = Provider(
            user_id=provider_user2.id,
            name="Beauty & Wellness Center",
            description="Comprehensive beauty and wellness center offering a range of cosmetic procedures and treatments.",
            address="456 Cosmetic Street",
            city="Seoul",
            country="South Korea",
            phone="+82 2 1234 5678",
            website="www.beautyandwellness.kr",
            license_number="KR98765",
            is_verified=True,
            featured=True,
            average_rating=4.9,
            total_reviews=45
        )
        db.add(provider2)
        
        provider3 = Provider(
            user_id=provider_user3.id,
            name="Dental Excellence Center",
            description="Specialized dental clinic offering advanced dental procedures at affordable prices.",
            address="789 Dental Avenue",
            city="Bangkok",
            country="Thailand",
            phone="+66 2 987 6543",
            website="www.dentalexcellence.th",
            license_number="DEN54321",
            is_verified=True,
            featured=False,
            average_rating=4.5,
            total_reviews=32
        )
        db.add(provider3)
        
        # Commit to get IDs
        db.commit()
        
        # Add specialties to providers
        provider1.specialties.append(hair_restoration)
        provider1.specialties.append(plastic_surgery)
        
        provider2.specialties.append(dermatology)
        provider2.specialties.append(plastic_surgery)
        provider2.specialties.append(wellness)
        
        provider3.specialties.append(dental)
        
        # Add treatments to providers
        hair_transplant = db.query(Treatment).filter_by(name="Hair Transplant").first()
        rhinoplasty = db.query(Treatment).filter_by(name="Rhinoplasty").first()
        botox = db.query(Treatment).filter_by(name="Botox Injection").first()
        liposuction = db.query(Treatment).filter_by(name="Liposuction").first()
        teeth_whitening = db.query(Treatment).filter_by(name="Teeth Whitening").first()
        dental_implants = db.query(Treatment).filter_by(name="Dental Implants").first()
        laser_skin = db.query(Treatment).filter_by(name="Laser Skin Resurfacing").first()
        
        provider1.treatments.append(hair_transplant)
        provider1.treatments.append(rhinoplasty)
        provider1.treatments.append(botox)
        
        provider2.treatments.append(botox)
        provider2.treatments.append(liposuction)
        provider2.treatments.append(laser_skin)
        provider2.treatments.append(rhinoplasty)
        
        provider3.treatments.append(teeth_whitening)
        provider3.treatments.append(dental_implants)
        
        # Commit changes
        db.commit()
        
        # Add treatment prices
        treatment_prices = [
            # Provider 1 prices
            TreatmentPrice(
                provider_id=provider1.id,
                treatment_id=hair_transplant.id,
                price=2500,
                currency="USD",
                description="Complete FUE hair transplant package including post-op care"
            ),
            TreatmentPrice(
                provider_id=provider1.id,
                treatment_id=rhinoplasty.id,
                price=3200,
                currency="USD",
                description="Complete rhinoplasty procedure with consultation and follow-up"
            ),
            TreatmentPrice(
                provider_id=provider1.id,
                treatment_id=botox.id,
                price=350,
                currency="USD",
                description="Botox treatment for forehead and crow's feet"
            ),
            
            # Provider 2 prices
            TreatmentPrice(
                provider_id=provider2.id,
                treatment_id=botox.id,
                price=400,
                currency="USD",
                description="Premium Botox treatment with Korean techniques"
            ),
            TreatmentPrice(
                provider_id=provider2.id,
                treatment_id=liposuction.id,
                price=3800,
                currency="USD",
                description="Advanced liposuction with minimal recovery time"
            ),
            TreatmentPrice(
                provider_id=provider2.id,
                treatment_id=laser_skin.id,
                price=800,
                currency="USD",
                description="Advanced laser skin resurfacing treatment"
            ),
            TreatmentPrice(
                provider_id=provider2.id,
                treatment_id=rhinoplasty.id,
                price=4000,
                currency="USD",
                description="K-Beauty rhinoplasty with natural results"
            ),
            
            # Provider 3 prices
            TreatmentPrice(
                provider_id=provider3.id,
                treatment_id=teeth_whitening.id,
                price=350,
                currency="USD",
                description="Professional teeth whitening with lasting results"
            ),
            TreatmentPrice(
                provider_id=provider3.id,
                treatment_id=dental_implants.id,
                price=1200,
                currency="USD",
                description="Per tooth implant including crown"
            )
        ]
        
        for price in treatment_prices:
            db.add(price)
        
        # Final commit
        db.commit()
        
        print("Sample data created successfully!")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()