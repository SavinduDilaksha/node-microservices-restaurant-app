# Restaurant Microservices Backend

This repository contains the backend microservices for the Restaurant Management Application. 
The project is built using Node.js and is split into separate microservices, each handling a specific domain.

## Microservices Architecture

1. API Gateway (api-gateway/) - Entry point for client requests.
2. Customer Service (customer-service/) - Manages customer profiles and authentication.
3. Menu Service (menu-service/) - Manages the restaurant menu and items.
4. Order Service (order-service/) - Handles customer orders and order tracking.
5. Payment Service (payment-service/) - Processes payments and invoices.
6. Reservation Service (reservation-service/) - Manages table reservations.

---

## Getting Started (For Team Members)

This repository currently contains the basic folder structure. Each team member must initialize their respective service from scratch.

### 1. Initialize Your Assigned Service
Navigate to your assigned folder:
cd <your-assigned-service-folder>

Initialize a new Node.js project:
npm init -y

Install necessary dependencies:
npm install express mongoose dotenv cors
npm install --save-dev nodemon

Setup your basic Express server inside your folder.

---

## Git Workflow & Collaboration

To avoid merge conflicts, every member must work on their own branch.

1. Pull the latest main branch:
   git checkout main
   git pull origin main

2. Create a new branch for your service:
   git checkout -b feature/<your-service-name>

3. Stage and Commit your changes:
   git add .
   git commit -m "feat: initial setup for service"

4. Push your branch to GitHub/GitLab:
   git push origin feature/<your-service-name>

5. Merge Process:
   - Go to GitHub/GitLab and create a Pull Request (PR) from your branch to main.
   - Ask another team member to Review and Merge your code.
