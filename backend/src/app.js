const express = require('express');
const songRoutes = require('./routes/song.routes');
const connectDB = require('./db/db');
const cors = require('cors');
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] }));

connectDB();

app.get("/", (req, res) => {
  res.send("MusIQ Server running");
});

app.use('/songs', songRoutes);


module.exports = app;  