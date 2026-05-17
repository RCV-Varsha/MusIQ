const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    audio: { type: String, required: true }, // ImageKit URL
    detectedMood: { type: String, required: true },
    moods: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now }
});

const Song = mongoose.model('song', songSchema);

module.exports = Song;