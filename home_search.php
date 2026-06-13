<?php
/**
 * JOB NOVA - Legacy home search AJAX handler.
 * MIGRATED: Job search is now handled by api/jobs.php (GET action=search or action=recent).
 * This endpoint is no longer used by the React frontend.
 */
header('Content-Type: application/json');
echo json_encode([
    "success" => false,
    "message" => "This endpoint is deprecated. Use GET /api/jobs.php?action=search&key=..."
]);
