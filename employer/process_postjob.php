<?php
/**
 * JOB NOVA - Employer post job processor.
 * MIGRATED: Job posting is now handled by api/jobs.php (POST action=post).
 * This endpoint is no longer used by the React frontend.
 */
header('Content-Type: application/json');
echo json_encode([
    "success" => false,
    "message" => "This endpoint is deprecated. Use POST /api/jobs.php with action=post."
]);