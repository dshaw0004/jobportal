<?php
/**
 * JOB NOVA - Employer notification badge count.
 * MIGRATED: Notification counts are fetched inline in EmployerDashboard.tsx
 * via api/employer.php (GET action=applicants).
 * This endpoint is no longer used by the React frontend.
 */
header('Content-Type: application/json');
echo json_encode([
    "success" => false,
    "message" => "This endpoint is deprecated. Notification counts are embedded in /api/employer.php responses."
]);