<?php
/**
 * JOB NOVA - Employer delete job processor.
 * MIGRATED: Job deletion is now handled by api/jobs.php (POST action=delete).
 * This endpoint is no longer used by the React frontend.
 */
header('Content-Type: application/json');
echo json_encode([
    "success" => false,
    "message" => "This endpoint is deprecated. Use POST /api/jobs.php with action=delete."
]);
