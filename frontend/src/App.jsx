import { useState, useEffect } from 'react';
import FacialExpression from './components/FacialExpression';
import MoodSongs from "./components/MoodSongs";
import PlayerBar from "./components/PlayerBar";
import Sidebar from "./components/Sidebar";
import MoodExplorer from "./components/MoodExplorer";
import { PlayerProvider, usePlayer } from "./context/PlayerContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import FavoritesView from "./components/FavoritesView";
import Toast from "./components/Toast";
import LibraryView from "./components/LibraryView";
import PlaylistsView from "./components/PlaylistsView";
import SettingsView from "./components/SettingsView";
import axios from 'axios';

import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const [emotion, setEmotion] = useState("");
  const [songs, setSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]); // Global cache
  const [activeSection, setActiveSection] = useState("now-playing");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { currentSong, isPlaying } = usePlayer();

  // Appearance System
  useEffect(() => {
    const saved = localStorage.getItem('musiq_settings');
    if (saved) {
      const { appearance } = JSON.parse(saved);
      const root = document.documentElement;
      
      // Apply Theme
      if (appearance.darkMode) {
        root.setAttribute('data-theme', 'deep-black');
      } else {
        root.removeAttribute('data-theme');
      }
      
      // Apply Accent
      const accentMap = {
        '#A855F7': 'purple',
        '#EC4899': 'pink',
        '#06B6D4': 'cyan',
        '#22C55E': 'green'
      };
      const accentKey = accentMap[appearance.accentColor] || 'purple';
      root.setAttribute('data-accent', accentKey);
    }
  }, [activeSection]); // Re-run on section change to ensure persistence if settings changed

  // Mood appearance
  useEffect(() => {
    const root = document.documentElement;
    if (emotion) {
      root.setAttribute('data-mood', emotion);
    } else {
      root.setAttribute('data-mood', 'neutral');
    }
  }, [emotion]);

  // Global fetch for all songs to reuse across components
  useEffect(() => {
    const fetchAllSongs = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL;
        console.log("Debugging VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
        const response = await axios.get(`${API_BASE}/songs`);
        if (response.data && response.data.songs) {
          setAllSongs(response.data.songs);
        }
      } catch (err) {
        console.error("Global Fetch Error:", err);
      }
    };
    fetchAllSongs();
  }, []);

  // Sidebar close on navigation (mobile)
  const navigateTo = (section) => {
    setActiveSection(section);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex bg-dark-bg min-h-screen text-white font-sans selection:bg-brand-500/30">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar (Fixed) & Mobile Sidebar (Drawer) */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block w-64 flex-shrink-0 z-50 transition-transform duration-300 ease-in-out`}>
        <Sidebar activeSection={activeSection} setActiveSection={navigateTo} />
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 text-white/40 hover:text-white lg:hidden"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto pb-36">
        
        {/* Top Header / Background Gradient */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none -z-10 opacity-50 mix-blend-screen transition-colors duration-1000 ease-in-out"
          style={{
            background: 'radial-gradient(circle at 50% 0%, var(--brand-glow) 0%, transparent 70%)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2 }}
        />

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-8 md:gap-12">
          
          {/* Header */}
          <header className="flex justify-between items-center lg:hidden sticky top-0 bg-dark-bg/80 backdrop-blur-md z-30 py-4 border-b border-white/5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Mus<span className="text-brand-500">IQ</span>
            </h1>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 bg-white/5 rounded-xl border border-white/10 text-white/80 hover:text-white transition-all"
            >
              <Menu size={24} />
            </button>
          </header>

          {activeSection === "now-playing" ? (
            <>
              {/* Top Section: Camera & Current Context */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left: Camera feature */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <h2 className="section-subtitle text-[11px]">Mood Scanner</h2>
                  <FacialExpression 
                    setSongs={setSongs} 
                    setEmotion={setEmotion} 
                    emotion={emotion} 
                    setActiveSection={setActiveSection}
                  />
                </div>

                {/* Right: Current Context / Album Art placeholder */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="lg:col-span-5 flex flex-col gap-4 h-full"
                >
                  <h2 className="section-subtitle text-[11px]">Now Playing</h2>
                  <div className="flex-1 glass rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden group min-h-[300px]">
                    {/* Background Art */}
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-900/20 to-transparent mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />
                    
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      {currentSong ? (
                        <>
                          <div className="flex justify-between items-end mt-auto">
                            <div>
                              <span className="text-brand-500 font-bold tracking-widest uppercase text-sm mb-2 block transition-colors duration-700">
                                {emotion ? `Mood: ${emotion}` : 'Now Playing'}
                              </span>
                              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white text-glow mb-2 truncate">
                                {currentSong.title}
                              </h1>
                              <p className="text-white/70 text-xl font-medium">{currentSong.artist}</p>
                            </div>
                            
                            {/* Animated waveform in context panel */}
                            {isPlaying && (
                              <div className="flex gap-1.5 h-10 items-end opacity-80 mb-2">
                                <div className="w-2 bg-brand-500 animate-[equalizer-bounce_1s_infinite_0.1s] rounded-t-sm transition-colors duration-700" />
                                <div className="w-2 bg-brand-500 animate-[equalizer-bounce_1.2s_infinite_0.3s] rounded-t-sm transition-colors duration-700" />
                                <div className="w-2 bg-brand-500 animate-[equalizer-bounce_0.8s_infinite_0s] rounded-t-sm transition-colors duration-700" />
                                <div className="w-2 bg-brand-500 animate-[equalizer-bounce_1.1s_infinite_0.4s] rounded-t-sm transition-colors duration-700" />
                                <div className="w-2 bg-brand-500 animate-[equalizer-bounce_0.9s_infinite_0.2s] rounded-t-sm transition-colors duration-700" />
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <motion.div 
                                animate={{ opacity: [0.3, 1, 0.3] }} 
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_var(--brand-glow)]"
                              />
                              <span className="text-brand-300/80 font-medium tracking-[0.2em] uppercase text-[10px]">
                                AI Mood Engine Active
                              </span>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-white/90">
                              {emotion ? emotion : "Awaiting Input"}
                            </h2>
                          </div>
                          
                          {/* Ambient Visualizer */}
                          <div className="h-16 flex items-center gap-1.5 mt-auto opacity-50">
                            {[...Array(6)].map((_, i) => (
                              <div 
                                key={i} 
                                className="w-1.5 bg-brand-500/40 rounded-full h-4 animate-pulse" 
                                style={{ animationDelay: `${i * 0.15}s` }} 
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Playlist Section */}
              <section className="w-full">
                <MoodSongs songs={allSongs} emotion={emotion} />
              </section>
            </>
          ) : activeSection === "favorites" ? (
            <FavoritesView />
          ) : activeSection === "moods" ? (
            <div className="w-full flex-1 pt-4 pb-12">
              <MoodExplorer 
                songs={songs} 
                setSongs={setSongs} 
                emotion={emotion} 
                setEmotion={setEmotion} 
              />
            </div>
          ) : activeSection === "all-songs" ? (
            <div className="w-full flex-1 pt-4">
              <LibraryView initialSongs={allSongs} />
            </div>
          ) : activeSection === "playlists" ? (
            <div className="w-full flex-1 pt-4">
              <PlaylistsView allSongs={allSongs} />
            </div>
          ) : activeSection === "settings" ? (
            <div className="w-full flex-1 pt-4">
              <SettingsView />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 h-[60vh] glass rounded-3xl border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-brand-900/10 mix-blend-overlay"></div>
              <h2 className="text-4xl font-bold text-white/50 capitalize z-10 text-glow">{activeSection.replace('-', ' ')}</h2>
              <p className="text-white/30 font-medium mt-4 z-10 tracking-widest uppercase">Coming Soon</p>
            </div>
          )}

        </div>
      </main>

      {/* Global Player Bar */}
      <PlayerBar />

      {/* Global Toast */}
      <Toast />

    </div>
  );
}

function App() {
  return (
    <FavoritesProvider>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </FavoritesProvider>
  );
}

export default App;
