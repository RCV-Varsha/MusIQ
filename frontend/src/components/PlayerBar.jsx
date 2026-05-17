import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { motion } from 'framer-motion';

export default function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    isShuffle,
    setIsShuffle,
    isRepeat,
    setIsRepeat,
    togglePlay,
    playNext,
    playPrev,
    seek
  } = usePlayer();

  if (!currentSong) return null;

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e) => {
    seek(Number(e.target.value));
  };

  const handleVolume = (e) => {
    setVolume(Number(e.target.value));
  };

  // Progress percentage for CSS custom property (used by the range track fill)
  const progressPct = duration ? `${(currentTime / duration) * 100}%` : '0%';
  const volumePct = `${volume * 100}%`;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 lg:bottom-6 left-4 right-4 lg:left-72 lg:right-8 glass bg-[var(--bg-card)]/70 backdrop-blur-3xl rounded-[2rem] p-3 md:p-4 flex items-center justify-between gap-4 z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
    >
        {/* Song Info */}
        <div className="flex items-center gap-4 md:gap-5 min-w-0 flex-1 md:flex-none md:w-1/4">
          {/* Thumbnail - Record Spin Effect */}
          <motion.div 
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-brand-700 to-brand-900 flex-shrink-0 flex items-center justify-center overflow-hidden relative box-glow ${isPlaying ? 'shadow-[0_0_20px_var(--brand-glow)]' : ''}`}
          >
            <Music size={20} className="text-white/60 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-transparent" />
            {/* Center Hole for record effect */}
            <div className="absolute inset-0 m-auto w-3 h-3 md:w-4 md:h-4 bg-dark-bg/80 backdrop-blur-md rounded-full z-20" />
          </motion.div>
          <div className="flex flex-col min-w-0">
            <span className="text-white font-bold truncate text-sm md:text-base leading-tight drop-shadow-md">{currentSong.title}</span>
            <span className="text-white/50 text-xs truncate">{currentSong.artist}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center flex-1 md:max-w-2xl gap-2 md:gap-3 px-2">
          <div className="flex items-center gap-3 md:gap-6">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsShuffle(!isShuffle)}
              className={`hidden sm:flex p-2 rounded-xl transition-all duration-300 ${isShuffle ? 'text-brand-500 bg-brand-500/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Shuffle size={18} />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={playPrev} 
              className="text-white/70 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5"
            >
              <SkipBack size={24} className="fill-current" />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-black flex items-center justify-center transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex-shrink-0"
            >
              {isPlaying
                ? <Pause size={22} className="fill-current" />
                : <Play size={22} className="fill-current ml-1" />
              }
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
              onClick={playNext} 
              className="text-white/70 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5"
            >
              <SkipForward size={24} className="fill-current" />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsRepeat(!isRepeat)}
              className={`hidden sm:flex p-2 rounded-xl transition-all duration-300 ${isRepeat ? 'text-brand-500 bg-brand-500/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Repeat size={18} />
            </motion.button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-[10px] text-white/40 font-medium tabular-nums w-8 text-right shrink-0">
              {formatTime(currentTime)}
            </span>
            <input 
              type="range" 
              min={0} 
              max={duration || 100} 
              value={currentTime} 
              onChange={handleSeek}
              style={{ '--progress': progressPct }}
              className="flex-1 h-1 rounded-full"
            />
            <span className="text-[10px] text-white/40 font-medium tabular-nums w-8 shrink-0">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden lg:flex items-center gap-2.5 w-1/4 justify-end min-w-[130px]">
          <Volume2 size={16} className="text-white/40 shrink-0" />
          <input 
            type="range" 
            min={0} 
            max={1} 
            step={0.01}
            value={volume} 
            onChange={handleVolume}
            style={{ '--progress': volumePct }}
            className="w-24 h-1 rounded-full"
          />
        </div>

    </motion.div>
  );
}
