# BraveAttendenceMgmtSys

Creating an Attendance Management System


### Build and Run container :
Development : 
    docker build -f frontend/Dockerfile.dev -t react-app-dev ./frontend
    docker run -p 5173:5173 -v $(pwd):/app react-app-dev

Production:
    docker build -f frontend/Dockerfile.prod -t react-app-prod ./frontend
    docker run -p 80:80 react-app-prod


### Run with :
Development  :   DOCKERFILE=Dockerfile.dev docker-compose up --build
Production   :   DOCKERFILE=Dockerfile.prod docker-compose up --build

The Frontend is available at http://localhost:3000


