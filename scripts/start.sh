
#!/bin/bash

# Load environment variables from .env
set -a
source .env
set +a

# Start the database
echo "Starting PostgreSQL container..."
./scripts/start_db.sh

# Wait a few seconds for the database to start
sleep 3

# Start backend server
echo "Starting backend server..."
cd backend && poetry run uvicorn main:app --host 0.0.0.0 --port 8000 &

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo "Starting frontend server..."
cd frontend && npm start &

# Keep the script running
wait