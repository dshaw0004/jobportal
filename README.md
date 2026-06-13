# JOB NOVA — Online Job Portal

A modern full-stack job portal with a **React/TypeScript** frontend (Vite + shadcn/ui) and a **PHP + MySQL** REST API backend.

---

## Architecture Overview

```
jobportal/
├── api/              ← PHP REST API endpoints (auth, jobs, jobseeker, employer, uploads)
├── config.php        ← Database connection (jobportal + location DBs)
├── uploads/          ← User-uploaded files (photos, resumes, logos)
├── Database/         ← SQL dump files for initial schema setup
└── frontend/         ← React/TypeScript SPA (Vite, Tailwind CSS, shadcn/ui)
```

The Vite dev server proxies `/api` and `/uploads` requests to the PHP backend at `localhost:8080`, so both services run concurrently without CORS issues.

---

## Prerequisites

| Tool | Minimum Version | Notes |
|---|---|---|
| PHP | 8.0+ | Must have the `mysqli` extension enabled |
| MySQL / MariaDB | 5.7+ | Either standalone or bundled via XAMPP/LAMPP |
| Node.js | 18+ | Required for the React frontend |
| npm | 9+ | Comes with Node.js |
| XAMPP / LAMPP | Any | Easiest way to get PHP + MySQL on both OSes |

---

## Database Setup (Both OS)

This step only needs to be done **once**.

1. Start MySQL via XAMPP/LAMPP.
2. Open **phpMyAdmin** at `http://localhost/phpmyadmin` (or use the MySQL CLI).
3. Create two databases:
   ```sql
   CREATE DATABASE jobportal;
   CREATE DATABASE location;
   ```
4. Import the SQL dumps:
   - Import `Database/JobPortal.sql` into the **`jobportal`** database.
   - Import `Database/location.sql` into the **`location`** database (if provided).
5. Verify the `config.php` credentials match your MySQL setup:
   ```php
   $host     = "localhost";
   $user     = "root";
   $password = "";          // Change if your MySQL root has a password
   $socket   = "/opt/lampp/var/mysql/mysql.sock";   // Linux LAMPP only — remove on Windows
   ```

---

## Running on Linux

### Step 1 — Install dependencies

```bash
cd frontend
npm install
```

### Step 2 — Start the PHP backend (Terminal 1)

Use the **LAMPP PHP binary** so the `mysqli` extension is available:

```bash
/opt/lampp/bin/php -S localhost:8080
```

> Run this from the **project root** (`jobportal/`), not from the `frontend/` folder.

Alternatively, start Apache via LAMPP and configure a virtual host pointing to the project root.

### Step 3 — Start the React frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

### Step 4 — Open the app

Navigate to **http://localhost:5173** in your browser.

---

## Running on Windows

### Step 1 — Install XAMPP

Download and install [XAMPP for Windows](https://www.apachefriends.org/download.html).  
Start **Apache** and **MySQL** from the XAMPP Control Panel.

### Step 2 — Place the project

Copy the `jobportal/` folder into your XAMPP web root:

```
C:\xampp\htdocs\jobportal\
```

### Step 3 — Update `config.php` for Windows

Open `config.php` and remove the Linux socket line. The Windows config should look like:

```php
$host     = "localhost";
$user     = "root";
$password = "";
$database1 = "jobportal";
$database2 = "location";

$db1 = new mysqli($host, $user, $password, $database1);
$db2 = new mysqli($host, $user, $password, $database2);
```

### Step 4 — Start the PHP backend (Terminal 1)

Open a **Command Prompt** or **PowerShell** in the project root and run:

```powershell
C:\xampp\php\php.exe -S localhost:8080
```

> If `php` is on your PATH, you can simply run: `php -S localhost:8080`

### Step 5 — Install Node.js dependencies

```powershell
cd frontend
npm install
```

### Step 6 — Start the React frontend (Terminal 2)

```powershell
cd frontend
npm run dev
```

### Step 7 — Open the app

Navigate to **http://localhost:5173** in your browser.

---

## API Endpoints Reference

All endpoints live under `/api/` and return `application/json`.

| Endpoint | Methods | Description |
|---|---|---|
| `api/auth.php` | GET, POST | Session check, login, logout, register jobseeker/employer |
| `api/jobs.php` | GET, POST | List recent jobs, search, post a job, delete a job |
| `api/jobseeker.php` | GET, POST | Profile, recommended jobs, apply, applied/selected status |
| `api/employer.php` | GET, POST | Company profile, view applicants, select/reject candidates |
| `api/location.php` | GET | Cascading country → state → city dropdown data |
| `api/upload.php` | POST | Upload profile photo, resume (PDF/DOC), company logo |

---

## Frontend Scripts

Run these from inside the `frontend/` directory:

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with hot-reload at `localhost:5173` |
| `npm run build` | Compile TypeScript and bundle for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run TypeScript type checking without emitting files |

---

## Troubleshooting

**`Class "mysqli" not found`**  
You are using the system PHP instead of the LAMPP PHP. On Linux, always use:
```bash
/opt/lampp/bin/php -S localhost:8080
```

**API calls return 502 / connection refused**  
The PHP backend is not running. Make sure Terminal 1 (the PHP server) is active before opening the app.

**Database connection errors**  
- Confirm MySQL is running via the XAMPP Control Panel.
- On Linux, verify the socket path in `config.php` matches `/opt/lampp/var/mysql/mysql.sock`.
- On Windows, remove the `$socket` parameter entirely.

**Port 8080 already in use**  
Change the port in `run.sh` (or your start command) and update the proxy target in `frontend/vite.config.ts` to match.

---

## License

Online-Job-Portal — A web application built on PHP, HTML & JavaScript  
Copyright (C) 2016 Sreelal C

This program is free software: you can redistribute it and/or modify it under the terms of the **GNU General Public License** as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

See [http://www.gnu.org/licenses/](http://www.gnu.org/licenses/) for full license text.
