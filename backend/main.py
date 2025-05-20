from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, providers, reviews, bookings, payments, users, treatments
from init_db import init_db
import os

app = FastAPI()
app.router.redirect_slashes = True # With or without trailing slash is treated same.

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, will replace with specific frontend URL
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

app.include_router(auth.router)
app.include_router(providers.router)
app.include_router(reviews.router)
app.include_router(bookings.router)
app.include_router(payments.router)
app.include_router(users.router)
app.include_router(treatments.router)

@app.get("/")
async def root():
    return {"message": "Welcome to MedPort API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.on_event("startup")
async def on_startup():
    init_db()

@app.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str):
    print(f"CORS Preflight to: /{rest_of_path}")
    return {}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
