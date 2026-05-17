# MusIQ

**An AI-powered emotion-adaptive music streaming experience.**

---

## 🌐 Live Deployment

**Frontend Experience:**
[https://musiq-eight.vercel.app](https://musiq-eight.vercel.app)

**Backend API Services:**
[https://musiq-use2.onrender.com](https://musiq-use2.onrender.com)

---

## 📸 Experience Preview

### Home Experience
![Home](./screenshots/home.png)

### Mood Detection
![Mood Detection](./screenshots/mood-detection.png)

### Cinematic Playlist
![Cinematic Playlist](./screenshots/cinematic-playlist.png)

### Mood Explorer
![Mood Explorer](./screenshots/mood-explorer.png)

### Favorites Section
![Favorites](./screenshots/favorites.png)

---

## ✨ Features

- **Real-time Facial Emotion Detection:** Utilizes advanced browser-based computer vision to analyze facial expressions and map them to musical moods instantly.
- **AI Mood-Based Song Recommendations:** Automatically curates and transitions to the perfect soundtrack based on the user's emotional state.
- **Cinematic Glassmorphism UI:** A highly polished, immersive dark-mode interface featuring dynamic light blooms and deep atmospheric gradients.
- **Emotion-Adaptive Gradients:** The application theme and color palette subconsciously shift to reflect the detected emotional tone.
- **Dynamic Playlists:** Instantly generated intelligent playlists grouped by mood semantics.
- **Favorites System:** Persistent local storage allowing users to curate and access their own loved tracks effortlessly.
- **Music Playback Controls:** Fully custom, responsive global audio context with seamless queue management and progress tracking.
- **Framer Motion Animations:** Extremely subtle, smooth micro-interactions that make the interface feel alive and premium.
- **Responsive Design:** Carefully crafted grid layouts ensure a consistent, flawless experience across desktop, tablet, and mobile browsers.

---

## 🛠️ Tech Stack

### Frontend
- **React** (Component Architecture & Global State)
- **Vite** (Next Generation Frontend Tooling)
- **Tailwind CSS** (Utility-First Styling & Responsive Grids)
- **Framer Motion** (Cinematic Animations & Transitions)

### Backend
- **Node.js** (JavaScript Runtime Environment)
- **Express.js** (RESTful API Framework)

### Database
- **MongoDB Atlas** (Cloud NoSQL Database)

### AI / Media
- **face-api.js** (Client-side Neural Network Emotion Tracking)
- **ImageKit** (Cloud Audio Storage & Media Optimization)

### Deployment
- **Vercel** (Frontend Hosting & Edge Delivery)
- **Render** (Backend Hosting & Compute)

---

## 🏗️ Architecture Overview

The system operates on a seamless, event-driven loop between the user's physical state and the audio engine:

```text
User ──► Webcam ──► Emotion Detection (face-api.js) ──► Mood Matching ──► Playlist Rendering ──► Audio Playback
```

---

## 🚀 Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/musiq.git
cd musiq
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*(Runs on `http://localhost:3000`)*

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*(Runs on `http://localhost:5173`)*

---

## 🔐 Environment Variables

For the application to function correctly, create the following `.env` files in their respective directories. 

> [!NOTE]
> Do not expose real credentials in your public repository.

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:3000
```

### Backend (`backend/.env`)
```env
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
FRONTEND_URL=http://localhost:5173
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
```

---

## ☁️ Deployment

- **Frontend:** Automatically deployed and scaled globally via **Vercel**.
- **Backend:** Hosted securely on **Render** utilizing web services.
- **Database:** Managed via **MongoDB Atlas** for high-availability cloud storage.

---

**Designed & Developed by RCV**
