<?php
/**
 * JOB NOVA - Jobseeker home search proxy.
 * MIGRATED: Job search is now handled by api/jobs.php (GET action=search).
 * This endpoint is no longer used by the React frontend.
 */
header('Content-Type: application/json');
echo json_encode([
    "success" => false,
    "message" => "This endpoint is deprecated. Use GET /api/jobs.php?action=search"
]);
