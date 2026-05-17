const mm = require("music-metadata");
const Song = require("../models/song.model");
const uploadFile = require("../service/storage.service");

const uploadSongs = async (req, res) => {
  console.log("\n--- Starting Song Upload Process ---");
  try {
    const { detectedMood, moods } = req.body;
    const files = req.files;

    // Validation
    if (!files || files.length === 0) {
      console.error("Upload Error: No files provided");
      return res.status(400).json({ error: "No files uploaded. Please attach at least one audio file." });
    }
    if (!detectedMood) {
      console.error("Upload Error: detectedMood is missing");
      return res.status(400).json({ error: "detectedMood is required for AI categorization." });
    }
    if (!moods) {
      console.error("Upload Error: moods field is missing");
      return res.status(400).json({ error: "moods field is required." });
    }

    // Normalize moods into an array
let normalizedMoods = [];

if (Array.isArray(moods)) {

  normalizedMoods = moods.map(
    (m) => m.trim().toLowerCase()
  );

} else if (typeof moods === "string") {

  try {

    // Try parsing JSON array string
    const parsed = JSON.parse(moods);

    if (Array.isArray(parsed)) {
      normalizedMoods = parsed.map(
        (m) => m.trim().toLowerCase()
      );
    } else {
      normalizedMoods = [String(parsed).trim().toLowerCase()];
    }

  } catch (err) {

    // Fallback for comma separated string
    normalizedMoods = moods
      .split(",")
      .map((m) => m.trim().toLowerCase());

  }
}

    // Remove duplicates and empty strings
    normalizedMoods = [...new Set(normalizedMoods.filter(Boolean))];

    if (normalizedMoods.length === 0) {
      console.error("Upload Error: Moods array is empty after normalization");
      return res.status(400).json({ error: "moods cannot be empty. Please provide at least one valid mood." });
    }

    console.log(`Processing upload for ${files.length} files. Detected mood: ${detectedMood}`);

    const uploadedSongs = [];

    for (const file of files) {
      
      // 1. Upload to ImageKit
      const storageResult = await uploadFile(file);

      // 2. Extract metadata from buffer
      let metadata;
      try {
        metadata = await mm.parseBuffer(file.buffer, { mimeType: file.mimetype });
      } catch (metaErr) {
        console.warn(`- Warning: Could not parse metadata for ${file.originalname}. Using filename instead.`);
        metadata = { common: {} };
      }

      // 3. Create Song in MongoDB
      const song = await Song.create({
        title: metadata.common.title || file.originalname,
        artist: metadata.common.artist || "Unknown Artist",
        audio: storageResult.url,
        detectedMood: detectedMood.toLowerCase(),
        moods: normalizedMoods,
      });

      uploadedSongs.push(song);
    }

    res.status(201).json({
      success: true,
      message: `${uploadedSongs.length} songs uploaded successfully`,
      songs: uploadedSongs,
    });
  } catch (err) {
    console.error("\nCRITICAL Upload Error:", err);
    res.status(500).json({ 
      error: "Internal server error during upload",
      details: err.message 
    });
  }
};

const getSongs = async (req, res) => {
  try {
    const mood = req.query.mood;

    if (!mood) {
      const allSongs = await Song.find().sort({ createdAt: -1 });
      return res.json({ success: true, songs: allSongs });
    }

    const filteredMood = mood.toLowerCase();

    const songs = await Song.find({
      $or: [
        { detectedMood: filteredMood },
        { moods: { $in: [filteredMood] } },
      ],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: songs.length,
      message: `Found ${songs.length} songs for mood: ${filteredMood}`,
      songs,
    });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Internal server error during fetch" });
  }
};

module.exports = {
  uploadSongs,
  getSongs,
};
