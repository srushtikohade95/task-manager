# Task Manager

A clean and aesthetic Task Manager application built with a vanilla frontend and a Node.js Express backend. 

## Overview
This application serves as a simple and effective todo list, showcasing a full-stack architecture running entirely locally. It uses pure HTML/CSS/JS without heavyweight frontend frameworks, coupled with a minimal RESTful Node.js backend.

## Features
- View all tasks, or filter them by Active and Completed status.
- Add, complete, delete, and edit tasks dynamically.
- Loading indicators and smooth error handling for network issues.
- Responsive, modern, and beautiful UI with micro-animations.

## Setup Instructions

### 1. Run the Backend
The backend runs on an Express server on `localhost:3000`.

1. Open your terminal.
2. Navigate to the `backend` folder: `cd backend`
3. Install dependencies: `npm install`
4. Start the server: `node server.js`

### 2. Run the Frontend
Because it is a static vanilla frontend, you just need a browser to view it.

1. Navigate to the `frontend` folder.
2. Open `index.html` in your web browser (you can drag and drop it into a new tab, or use an extension like Live Server).

## Trade-offs

A notable architectural trade-off here is the use of **in-memory data structures joined with a flat JSON file (`tasks.json`)** instead of a formal relational (SQL) or NoSQL database.

**Pros of File Storage:**
- Ridiculously easy to set up with 0 external dependencies (no docker containers, no DB hosts required).
- Extremely fast for tiny to small amounts of data.
- State persists cleanly across server restarts.

**Cons of File Storage:**
- Does not scale for large traffic or data sizes. Overwriting a JSON file continually on high concurrent writes will lead to race conditions and corrupted data.
- Poor querying performance. Searching large datasets requires loading the entire dataset into memory. 
- Locking and transactional rollback aren't natively supported.
