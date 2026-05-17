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
    return null;
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