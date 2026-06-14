# Job Nova API Coverage Documentation

This document provides a comprehensive reference of the API endpoints available in the `api/` directory of the Job Nova online job portal. All endpoints communicate using JSON payloads (except file uploads which use `multipart/form-data`) and return JSON responses.

---

## 1. Authentication & Registration (`auth.php`)

Handles registration, user login/logout, and session verification.

| Method | Endpoint / Action | Payload / Query Params | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/auth.php` | None | No | Checks current session. Returns user profile details for either `jobseeker` or `employer` if authenticated; otherwise, returns `"success": false`. |
| **POST** | `/api/auth.php` | `{ "action": "login", "email": "...", "password": "..." }` | No | Authenticates user (jobseeker or employer) and initializes session variables. |
| **POST** | `/api/auth.php` | `{ "action": "logout" }` | No | Logs out user and destroys the active session. |
| **POST** | `/api/auth.php` | `{ "action": "register_seeker", "email": "...", "password": "...", "name": "...", "phone": "...", "experience": "...", "skills": "...", "ugcourse": "...", "pgcourse": "...", "country": "...", "state": "...", "city": "..." }` | No | Registers a new jobseeker profile. Automatically resolves country/state/city IDs into names using the location database. |
| **POST** | `/api/auth.php` | `{ "action": "register_employer", "email": "...", "password": "...", "ename": "...", "comtype": "...", "indtype": "...", "address": "...", "pincode": "...", "executive": "...", "phone": "...", "profile": "...", "country": "...", "state": "...", "city": "..." }` | No | Registers a new employer account with inactive status (pending admin approval). Resolves location IDs. |

---

## 2. Employer Services (`employer.php`)

All requests require an active employer session (`$_SESSION['eid']` and `$_SESSION['elogid']`).

| Method | Endpoint / Action | Payload / Query Params | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/employer.php?action=profile` | None | Retrieves the profile details of the logged-in employer. |
| **GET** | `/api/employer.php?action=applicants` | `&jid=<job_id>` (optional) | Retrieves a list of candidates who have applied for the employer's jobs (optionally filtered by a specific job ID). |
| **GET** | `/api/employer.php?action=candidate_detail` | `&jsid=<jsid>` (required) | Retrieves the public profile details of a specific candidate (name, skills, qualifications, resume, etc.). |
| **POST** | `/api/employer.php` | `{ "action": "update", "ename": "...", "comtype": "...", "indtype": "...", "address": "...", "pincode": "...", "executive": "...", "phone": "...", "profile": "...", "country": "...", "state": "...", "city": "..." }` | Updates the employer's profile details. Location lookup variables are optional and processed only if all three are provided. |
| **POST** | `/api/employer.php` | `{ "action": "select", "user_id": <user_id>, "job_id": <job_id> }` | Marks a candidate as "Selected" for a job posting. |
| **POST** | `/api/employer.php` | `{ "action": "reject", "user_id": <user_id>, "job_id": <job_id> }` | Marks a candidate application as "Rejected" and removes them from selections. |

---

## 3. Job Board & Listings (`jobs.php`)

Provides endpoints to search, read, post, and delete job listings.

| Method | Endpoint / Action | Payload / Query Params | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/jobs.php?action=recent` | None | No | Retrieves the 20 most recent job postings with employer logo and name details. |
| **GET** | `/api/jobs.php?action=search` | `&keyword=<keyword>` OR `&com=<com>&loc=<loc>&desig=<desig>&skills=<skills>&industry=<industry>` | No | Performs simple keyword-based search or advanced filtering on jobs. |
| **GET** | `/api/jobs.php?action=detail` | `&jid=<job_id>` (required) | No | Retrieves detailed information for a single job. Checks session to see if the logged-in jobseeker has already applied (`has_applied`). |
| **GET** | `/api/jobs.php?action=manage` | None | Yes (Employer) | Retrieves the active employer's own job postings including total application counts. |
| **POST** | `/api/jobs.php` | `{ "action": "post", "title": "...", "vacno": <vacancies>, "jobdesc": "...", "experience": "...", "basicpay": "...", "fnarea": "...", "industry": "...", "ugqual": "...", "pgqual": "...", "jprofile": "...", "country": "...", "state": "...", "city": "..." }` | Yes (Employer) | Posts a new job listing with localized city/state/country resolution. |
| **POST** | `/api/jobs.php` | `{ "action": "delete", "jid": <job_id> }` | Yes (Employer) | Deletes a job listing after verifying ownership. |

---

## 4. Jobseeker Services (`jobseeker.php`)

All requests require an active jobseeker session (`$_SESSION['jsid']` and `$_SESSION['id']`).

| Method | Endpoint / Action | Payload / Query Params | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/jobseeker.php?action=profile` | None | Retrieves the profile details of the logged-in jobseeker. |
| **GET** | `/api/jobseeker.php?action=recommended` | None | Lists jobs matching the jobseeker's UG or PG educational credentials. |
| **GET** | `/api/jobseeker.php?action=applied` | None | Lists all jobs the jobseeker has applied to, showing application dates and status. |
| **GET** | `/api/jobseeker.php?action=selected` | None | Lists all jobs where the jobseeker has been accepted/shortlisted. |
| **POST** | `/api/jobseeker.php` | `{ "action": "update", "name": "...", "phone": "...", "experience": "...", "skills": "...", "ugcourse": "...", "pgcourse": "...", "other_qual": "...", "country": "...", "state": "...", "city": "..." }` | Updates the jobseeker's profile information. Location details are resolved if provided. |
| **POST** | `/api/jobseeker.php` | `{ "action": "apply", "jid": <job_id> }` | Submits an application for a specific job. |

---

## 5. Location Lookup (`location.php`)

Retrieves geography details from the location lookup database.

| Method | Endpoint / Action | Payload / Query Params | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/location.php?type=getCountries` | None | No | Lists all countries sorted alphabetically. |
| **GET** | `/api/location.php?type=getStates` | `&countryId=<country_id>` (required) | No | Lists all states corresponding to the given country. |
| **GET** | `/api/location.php?type=getCities` | `&stateId=<state_id>` (required) | No | Lists all cities corresponding to the given state. |

---

## 6. Media & Document Upload (`upload.php`)

Handles file uploads as standard multipart form-data. File data must be uploaded under the `file` input field name.

| Method | Endpoint / Action | Allowed File Types | Constraints | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/upload.php?type=image` | `.jpeg`, `.png`, `.jpg` | Max 500KB, Max 1200x1200px | Yes (Jobseeker) | Uploads and overwrites the jobseeker's profile photo. Saves to `/uploads/images/`. |
| **POST** | `/api/upload.php?type=logo` | `.jpeg`, `.png`, `.jpg` | Max 500KB, Max 800x800px | Yes (Employer) | Uploads and overwrites the employer's company logo. Saves to `/uploads/logo/`. |
| **POST** | `/api/upload.php?type=file` | `.doc`, `.docx`, `.pdf` | Max 2MB | Yes (Jobseeker) | Uploads and overwrites the jobseeker's resume document. Saves to `/uploads/resume/`. |
