from database import engine
from models import Base
import models

def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__": # In case we run the database manually.
    init_db()