<?php
/**
 * JOB NOVA - Jobseeker apply to job processor.
 * MIGRATED: Job applications are now handled by api/jobseeker.php (POST action=apply).
 * This endpoint is no longer used by the React frontend.
 */
header('Content-Type: application/json');
echo json_encode([
    "success" => false,
    "message" => "This endpoint is deprecated. Use POST /api/jobseeker.php with action=apply."
]);