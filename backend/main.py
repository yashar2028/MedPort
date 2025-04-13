from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, providers, reviews, bookings, payments, users
import os

app = FastAPI(title="MedPort API", description="API for MedPort Medical Tourism Platform")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request, call_next):
    print(f"\n=== Incoming Request ===")
    print(f"Method: {request.method}")
    print(f"URL: {request.url}")
    print(f"Headers: {request.headers}")
    
    response = await call_next(request)
    
    print(f"\n=== Response ===")
    print(f"Status: {response.status_code}")
    return response

# Include routers
app.include_router(auth.router)
app.include_router(providers.router)
app.include_router(reviews.router)
app.include_router(bookings.router)
app.include_router(payments.router)
app.include_router(users.router)

@app.get("/")
async def root():
    return {"message": "Welcome to MedPort API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
