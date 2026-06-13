<?php
/**
 * JOB NOVA - Jobseeker registration processor.
 * MIGRATED: Registration is now handled by api/auth.php (POST action=register_jobseeker).
 * This endpoint is no longer used by the React frontend.
 */
header('Content-Type: application/json');
echo json_encode([
    "success" => false,
    "message" => "This endpoint is deprecated. Use POST /api/auth.php with action=register_jobseeker."
]);