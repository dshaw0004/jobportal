<?php
/**
 * JOB NOVA - Entry point redirects to the React frontend.
 * All UI has been migrated to frontend/ (React/Vite).
 * This file now simply redirects visitors to the new SPA.
 */
header('Location: http://localhost:5173/');
exit;
