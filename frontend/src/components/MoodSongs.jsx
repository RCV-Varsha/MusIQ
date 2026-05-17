import React, { useEffect } from "react";
import { Music, AlertCircle, Loader2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import SongRow from "./SongRow";
import PlaylistHeader from "./PlaylistHeader";
import { motion } from "framer-motion";

const MoodSongs = React.memo(({ songs, emotion }) => {
  const { currentSong, currentSongIndex, isPlaying, playSong, togglePlay, setQueue } = usePlayer();

  const detectedMood = emotion ? emotion.toLowerCase().trim() : "";
  const safeSongs = Array.isArray(songs) ? songs : [];

  // Frontend Mood Filtering Logic
  let filteredSongs = [];
  if (safeSongs.length > 0 && detectedMood) {
    filteredSongs = safeSongs.filter(song => {
      const matchMoods = song.moods?.some(m => m?.toLowerCase().trim() === detectedMood);
      const matchMood = song.mood?.toLowerCase().trim() === detectedMood;
      const matchDetected = song.detectedMood?.toLowerCase().trim() === detectedMood;
      return matchMoods || matchMood || matchDetected;
    });

    // Graceful Fallback
    if (filteredSongs.length === 0) {
      filteredSongs = safeSongs.filter(song => {
        const matchMoods = song.moods?.some(m => m?.toLowerCase().trim() === 'neutral');
        const matchMood = song.mood?.toLowerCase().trim() === 'neutral';
        const matchDetected = song.detectedMood?.toLowerCase().trim() === 'neutral';
        return matchMoods || matchMood || matchDetected;
      });
      
      // Ultimate fallback: all songs
      if (filteredSongs.length === 0) {
        filteredSongs = safeSongs;
      }
    }
  }

  // Sync songs list to player queue
  useEffect(() => {
    if (filteredSongs && filteredSongs.length > 0) {
      // Prevent infinite loop by checking if the queue actually needs an update
      setQueue(prev => {
         if (prev.length === filteredSongs.length && prev.every((s, i) => s._id === filteredSongs[i]._id)) return prev;
         return filteredSongs;
      });
    }
  }, [filteredSongs, setQueue]);

  if (!emotion) {
    return (
      <div className="p-10 md:p-14 rounded-[2.5rem] bg-gradient-to-r from-black/20 to-black/40 border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-stretch min-h-[320px] group shadow-2xl">
        {/* Soft immersive ambient glow */}
        <div className="absolute inset-0 bg-radial from-brand-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        {/* LEFT: Typography & CTA */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-xl space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
              Your emotions deserve <br className="hidden md:block"/> a soundtrack.
            </h2>
            <p className="text-base md:text-lg text-white/50 leading-relaxed font-light max-w-md">
              Let our AI analyze your vibe and instantly curate the perfect music for this exact moment.
            </p>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-6 px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium tracking-wide shadow-[0_0_20px_var(--brand-glow-subtle)] hover:shadow-[0_0_30px_var(--brand-glow)] transition-all duration-300 w-max flex items-center gap-2"
            >
              Start Mood Scan
            </motion.button>
          </motion.div>
        </div>

        {/* RIGHT: Cinematic Ambient Visualization */}
        <div className="relative z-0 flex-1 min-h-[250px] md:min-h-full flex items-center justify-center overflow-hidden">
          {/* Deep layered auras */}
          <motion.div 
            animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.05, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[10%] top-[20%] w-64 h-64 bg-brand-600/10 blur-[80px] rounded-full mix-blend-screen"
          />
          <motion.div 
            animate={{ opacity: [0.05, 0.2, 0.05], scale: [1.05, 0.95, 1.05] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[10%] bottom-[10%] w-48 h-48 bg-brand-400/10 blur-[60px] rounded-full mix-blend-screen"
          />
          
          {/* Subtle slow waveform pulse */}
          <div className="relative flex items-center justify-center gap-1.5 opacity-30">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <motion.div 
                key={i}
                animate={{ height: [`${20 + Math.random() * 10}px`, `${40 + Math.random() * 30}px`, `${20 + Math.random() * 10}px`] }}
                transition={{ duration: 4 + (i * 0.3), repeat: Infinity, ease: "easeInOut" }}
                className="w-1 bg-brand-300 rounded-full blur-[1px]"
              />
            ))}
          </div>
          
          {/* Tiny slow particle drift */}
          <motion.div 
            animate={{ y: [-10, 10, -10], x: [-3, 3, -3], opacity: [0, 0.15, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 left-1/4 w-1 h-1 bg-white rounded-full blur-[1px]"
          />
          <motion.div 
            animate={{ y: [10, -10, 10], x: [3, -3, 3], opacity: [0, 0.1, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-brand-200 rounded-full blur-[1px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PlaylistHeader 
        title={emotion.replace(/-/g, ' ')}
        subtitle="AI Detected Mood"
        description="We've curated these tracks based on your current vibe."
        mood={emotion}
        icon={Music}
        onPlay={() => { if(filteredSongs && filteredSongs.length > 0) playSong(0, filteredSongs); }}
        songCount={filteredSongs?.length || 0}
      />

      <div className="flex flex-col gap-2 relative z-10">
        {safeSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 glass rounded-3xl border-white/5 text-center h-[300px]">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
            <p className="text-white/60 font-medium tracking-widest uppercase text-sm">Loading Library...</p>
          </div>
        ) : (!filteredSongs || filteredSongs.length === 0) ? (
          <div className="flex flex-col items-center justify-center p-12 md:p-16 glass rounded-3xl border-white/5 text-center h-[300px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-500/10 flex items-center justify-center mb-6 mx-auto box-glow">
                <Music className="w-8 h-8 md:w-10 md:h-10 text-brand-500/50" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No songs added for this vibe yet ✨</h3>
              <p className="text-white/40 font-medium max-w-xs mx-auto text-sm md:text-base">
                Try scanning your face or uploading new tracks to categorize them as <span className="text-brand-500 capitalize">{emotion.replace(/-/g, ' ')}</span>.
              </p>
            </div>
          </div>
        ) : (
          filteredSongs.map((song, i) => {

          // Robust active check matching user constraints
          const isActive = currentSong && 
            ((currentSong._id && song._id && currentSong._id === song._id) || 
             (currentSong.audio === song.audio));
          
          return (
            <SongRow 
              key={song._id || song.audio || i}
              song={song}
              index={i}
              isActive={isActive}
              isPlaying={isPlaying}
              onPlayToggle={(idx, q) => {
                if (isActive) togglePlay();
                else playSong(idx, q);
              }}
              queueContext={filteredSongs}
            />
          );
        })
      )}
      </div>
    </div>
  );
});

MoodSongs.displayName = 'MoodSongs';

export default MoodSongs;