from database import engine
from models import Base
import models  # Import the models module to ensure all models are loaded

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()