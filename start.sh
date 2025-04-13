
#!/bin/bash

# Start backend server
cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 5000 &

# Start frontend server
cd frontend && node start.js &

# Keep the script running
wait
