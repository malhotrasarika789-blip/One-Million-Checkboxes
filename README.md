1 Million Checkboxes - Real-Time Scalable System
A high-performance, real-time full-stack application where users can interact with a massive grid of checkboxes simultaneously. This project demonstrates expert-level handling of WebSockets, Redis state management, and custom security protocols.

## Live Links
Frontend (Vercel): https://one-million-checkboxes-silk.vercel.app

Backend (Render): https://one-million-checkboxes-1.onrender.com


## Tech Stack
Frontend: HTML5, CSS3, JavaScript (Vanilla)

Backend: Node.js, Express.js

Real-time: Socket.io (WebSockets)

Database/Cache: Redis (Managed)

Auth: OIDC / OAuth 2.0 Flow

## Project Structure
Based on the clean architecture implemented in this project:

Plaintext
one-million-checkbox/
├── backend/               # Express Server & Socket Logic
│   ├── rateLimiter.js     # Custom Sliding Window Rate Limiter
│   ├── redis.js           # Redis Connection & Bitmap Logic
│   └── server.js          # Main entry point
├── frontend/              # Client-side files
│   ├── index.html         # Grid UI
│   ├── script.js          # Socket.io Client & Logic
│   └── style.css          # Premium UI Styling
├── .env.example           # Template for environment variables
└── vercel.json            # Deployment configuration
## Key Implementation Details
1. State Management (Redis Bitmaps)
To handle 1 million checkboxes efficiently, I used Redis Bitmaps.

Storage: Instead of 1 million keys, states are stored as bits (0/1). 1M bits consume only ~125KB memory.

Persistence: The state is retrieved using GETBIT and updated via SETBIT, ensuring data survives server restarts.

2. Custom Rate Limiting (Manual Implementation)
As per the requirement to NOT use external packages like express-rate-limit, I built a custom solution:

Logic: Uses Redis to track event counts per user/IP within a sliding time window.

Protection: Automatically blocks WebSocket spamming or bot-like behavior to ensure system stability.

3. WebSocket & Redis Pub/Sub
Real-time Sync: When a checkbox is toggled, an event is emitted and broadcasted to all connected clients.

Horizontal Scaling: Redis Pub/Sub allows multiple backend instances to coordinate checkbox updates seamlessly.

4. Authentication Flow
The app includes an OIDC / OAuth 2.0 based login.

Only authenticated users can interact with the checkboxes, while guests have restricted/read-only access.

## How to Run Locally
Clone the repository.

Navigate to backend/, run npm install.

Create a .env file based on .env.example.

Start the server: node server.js.

Open frontend/index.html in your browser.

## Evaluation Checklist Status
[x] Core Functionality: Checkbox grid is usable and state is maintained.

[x] Custom Rate Limiting: Implemented manually without external packages.

[x] Redis Usage: Bitmaps and Pub/Sub used for scaling.

[x] Clean Code: Separated logic for sockets, rate-limiting, and routes.
