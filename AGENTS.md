# Project Context: Online Job Portal (JOB NOVA)

This document provides a comprehensive overview of the Online Job Portal project, its codebase architecture, modules, and database structure.

---

## Technical Stack
* **Backend**: PHP, MySQL (via `mysqli`)
* **Frontend**: HTML, CSS, JavaScript, jQuery, Bootstrap (v3)

The application communicates with two databases:
1. **`jobportal`**: Manages accounts, profiles, job postings, applications, and selection states.
2. **`location`**: Houses lookup data for countries, states, and cities for dynamic dropdown selectors.

---

## Directory Structure & Key Components

### 1. Root Directory (Public Pages & Entrypoints)
* **`index.php`**: Landing page featuring a search bar, recent jobs tab, navigation, recruiter slideshow, and links to registration pages.
* **`login.php` & `process_login.php`**: Authentication logic. Jobseeker and employer passwords are encrypted with bcrypt and verified with PHP's `password_verify()`.
* **`forgotpass.php`**: Handles password recovery processes.
* **`home_search.php`**: An AJAX endpoint that handles the basic keyword search from the home page.
* **`upload.php`**: Centrally manages three file uploads:
  * **Jobseeker Photo**: Saved to `uploads/images/` (restricted to max $700 \times 700$ px).
  * **Employer Logo**: Saved to `uploads/logo/` (restricted to max $300 \times 300$ px).
  * **Jobseeker Resume**: Saved to `uploads/resume/` (PDF, DOC, DOCX support).

### 2. Jobseeker Module (`jobseeker/`)
* **`register_user.php` / `process_user.php`**: Standard candidate registration including education, skills, location, and resume credentials.
* **`profile.php`**: The main candidate dashboard showing:
  * **Profile Details**: Name, email, skills, and qualifications.
  * **Recommended Jobs**: Automated job matches matching the candidate's UG/PG qualifications.
  * **Advanced Search** (`adv_search.php`): Allows candidates to search for jobs by company, location, title, and key skills.
  * **Resume Upload**: Form to manage the candidate's CV document.
* **`apply_job.php`**: Inserts a new row in the `application` table.
* **`view_applied.php` / `view_selected.php`**: Allows jobseekers to track submitted applications and their selection states.

### 3. Employer Module (`employer/`)
* **`register_emp.php` / `process_regemp.php`**: Standard registration for company accounts.
* **`profile.php`**: The main employer dashboard showing company details and options to manage listings.
* **`post_jobs.php` / `process_postjob.php`**: Forms and validation for posting new job vacancies.
* **`managejobs.php` / `deletejob.php`**: Enables employers to modify vacancy details or delete jobs.
* **`manage_applicants.php`**: Lists candidates who have applied for postings. Employers can inspect candidate details (`view_js.php`) and approve (`process_select.php`) or reject (`process_reject.php`) them.
* **`notify.php`**: Count functions displaying the badge of pending notifications/applications.

### 4. Location Module (`location/`)
* Provides country, state, and city dynamic dropdown inputs:
  * **`api.php`**: Handles AJAX API calls from the frontend `location.js` script.
  * **`classes/location.php`**: Query runner and processor class using the `location` database configuration (`classes/dbconfig.php`).

---

## Database Schemas (`Database/JobPortal.sql`)
* **`login`**: Shared credentials table storing `email`, `password`, `usertype` (`jobseeker` or `employer`), and account `status`.
* **`jobseeker`**: Jobseeker profiles linked to `login.log_id`.
* **`employer`**: Employer profiles linked to `login.log_id`.
* **`jobs`**: Job postings details linked to `employer.eid`.
* **`application`**: Maps `jobseeker`, `employer`, and `jobs` together to track active applications.
* **`selection`**: Maps accepted/shortlisted candidates.
* **`admin`**: System administrator login credentials.
