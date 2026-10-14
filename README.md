\# Task Management Dashboard



A full-stack task management project built to organize tasks, track progress, and display task statistics through a dashboard.



\## Features



\- View tasks stored in a PostgreSQL database

\- Track total, completed, and pending tasks

\- Display task details such as category, priority, and status

\- REST API built with Node.js and Express

\- Angular dashboard for visualizing task information



\## Tech Stack



\- \*\*Frontend:\*\* Angular, TypeScript, HTML, CSS

\- \*\*Backend:\*\* Node.js, Express.js

\- \*\*Database:\*\* PostgreSQL

\- \*\*Tools:\*\* Git, GitHub, VS Code



\## Project Structure



\- `backend/` — Express API and PostgreSQL connection

\- `dashboard/` — Angular task dashboard

\- `frontend/` — React frontend project



\## Getting Started



\### 1. Clone the repository



```bash

git clone https://github.com/sejalshinde2004/task-management-dashboard.git

cd task-management-dashboard

```



\### 2. Configure the backend



```bash

cd backend

npm install

```



Create a `.env` file inside the `backend/` directory:



```env

DB\_HOST=localhost

DB\_PORT=5432

DB\_NAME=task\_manager

DB\_USER=your\_username

DB\_PASSWORD=your\_postgresql\_password

```



Replace `your\_postgresql\_password` with your own PostgreSQL password. Do not upload the `.env` file to GitHub.



\### 3. Start the backend



```bash

node server.js

```



API endpoint: `http://localhost:5000/api/tasks`



\### 4. Start the Angular dashboard



Open another terminal:



```bash

cd dashboard

npm install

npm start

```



Open `http://localhost:4200` in your browser.



\## Database



Create a PostgreSQL database named `task\_manager` and configure the required `tasks` table before running the application.



\## Author



\*\*Sejal Shinde\*\*



\[GitHub](https://github.com/sejalshinde2004)

