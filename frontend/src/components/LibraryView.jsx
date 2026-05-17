import React, { useState, useMemo, useEffect } from 'react';
import { Search, SortAsc, SortDesc, Filter, Music, Loader2, Clock } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import SongRow from './SongRow';
import { usePlayer } from '../context/PlayerContext';

export default function LibraryView({ initialSongs = [] }) {
  const [allSongs, setAllSongs] = useState(initialSongs);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // recent, title, artist
  
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();

  // Sync with initialSongs if they change, but prioritize independent fetch for stability
  useEffect(() => {
    if (initialSongs.length > 0) {
      setAllSongs(initialSongs);
      setIsLoading(false);
    }
  }, [initialSongs]);

  // Debounce search query to optimize performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Independent fetch to ensure complete library is always available
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${API_BASE}/songs`);
        if (response.data && response.data.songs) {
          setAllSongs(response.data.songs);
        }
      } catch (err) {
        console.error("Library Independent Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSongs();
  }, []);

  // Memoized filtering and sorting
  const processedSongs = useMemo(() => {
    let filtered = allSongs;
    
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      filtered = allSongs.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.artist.toLowerCase().includes(q)
      );
    }

    const sorted = [...filtered];
    if (sortBy === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "artist") {
      sorted.sort((a, b) => a.artist.localeCompare(b.artist));
    } else if (sortBy === "recent") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return sorted;
  }, [allSongs, debouncedQuery, sortBy]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
        <p className="text-white/40 font-bold uppercase tracking-widest animate-pulse">Building Library...</p>
      </div>
    );
  }

  return (
    <div className="unified-spacing animate-in fade-in duration-700">
      
      {/* Standardized Header & Controls */}
      <div className="sticky top-0 z-20 bg-dark-bg/80 backdrop-blur-md py-4 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-white/5">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Collection</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Music Library</h2>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Bar - Standardized */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input 
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand-500/30 transition-all"
            />
          </div>

          {/* Sort Control - Standardized */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setSortBy('recent')}
              className={`p-2 rounded-lg transition-all ${sortBy === 'recent' ? 'bg-white/10 text-white shadow-xl' : 'text-white/30 hover:text-white/60'}`}
              title="Sort by Recent"
            >
              <Clock size={18} />
            </button>
            <button 
              onClick={() => setSortBy('title')}
              className={`p-2 rounded-lg transition-all ${sortBy === 'title' ? 'bg-white/10 text-white shadow-xl' : 'text-white/30 hover:text-white/60'}`}
              title="Sort by Title"
            >
              <SortAsc size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.03 } }
        }}
        className="flex flex-col gap-2 min-h-[400px]"
      >
        {processedSongs.length > 0 ? (
          processedSongs.map((song, i) => {
            const isActive = currentSong && (currentSong._id === song._id || currentSong.audio === song.audio);
            return (
              <motion.div 
                key={song._id || song.audio || i} 
                variants={{ hidden: { opacity: 0, y: 5 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
              >
                <SongRow 
                  song={song}
                  index={i}
                  isActive={isActive}
                  isPlaying={isPlaying}
                  onPlayToggle={(idx) => {
                    if (isActive) togglePlay();
                    else playSong(idx, processedSongs);
                  }}
                />
              </motion.div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center p-20 glass rounded-3xl border-white/5 opacity-50">
            <Music className="w-16 h-16 text-white/10 mb-6" />
            <p className="text-xl font-semibold text-white/20 tracking-wide uppercase">
              {searchQuery ? "No matches found for your search" : "Your music library is empty"}
            </p>
            {!searchQuery && (
              <p className="text-sm text-white/20 mt-2">Upload some tracks to get started ✨</p>
            )}
          </div>
        )}
      </motion.div>

    </div>
  );
}
