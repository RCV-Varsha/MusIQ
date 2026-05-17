const express = require('express');
const multer = require('multer');
const router = express.Router();
const songController = require('../controller/song.controller');

// Multer Configuration (Memory Storage for ImageKit)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }
});

// POST /songs - Upload multiple songs
router.post(
    '/',
    upload.array("songs", 10),
    songController.uploadSongs
);

// GET /songs - Fetch songs by mood
// Usage: /songs?mood=happy
router.get("/", songController.getSongs);

module.exports = router;