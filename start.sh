
#!/bin/bash

# Kill any existing processes on our ports
fuser -k 5000/tcp 2>/dev/null
fuser -k 5001/tcp 2>/dev/null

# Start backend server
cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 5000 &

# Wait a moment for backend to start
sleep 2

# Start frontend server
cd ../frontend && node start.js &

# Keep the script running
wait
