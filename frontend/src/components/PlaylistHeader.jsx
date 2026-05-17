import React from 'react';
import { Play, ChevronLeft, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMoodTheme } from '../config/moodThemes';

export default function PlaylistHeader({ 
  title, 
  subtitle, 
  description,
  mood, 
  icon: Icon = Music, 
  onPlay, 
  onBack,
  songCount
}) {

  const style = getMoodTheme(mood);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative rounded-3xl md:rounded-[2rem] overflow-hidden min-h-[180px] md:min-h-[260px] flex items-end p-5 md:p-8 border border-white/10 shadow-2xl group mb-6 md:mb-8"
    >
      {/* Background Cinematic Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-80 mix-blend-screen transition-opacity duration-1000`} />
      
      {/* Deep Glass Overlay */}
      <div className="absolute inset-0 bg-dark-bg/40 backdrop-blur-[4px]" />
      
      {/* Subtle Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <motion.div 
           animate={{ y: [0, -10, 0], opacity: [0.1, 0.2, 0.1] }}
           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl mix-blend-screen"
         />
         <motion.div 
           animate={{ y: [0, 15, 0], opacity: [0.05, 0.15, 0.05] }}
           transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
           className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl mix-blend-screen"
         />
      </div>

      {/* Back Button */}
      {onBack && (
        <motion.button 
          whileHover={{ x: -4, backgroundColor: "rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="absolute top-6 left-6 p-2.5 rounded-xl bg-white/5 text-white/60 hover:text-white transition-colors z-20 flex items-center gap-2 pr-4 border border-white/10 backdrop-blur-md"
        >
          <ChevronLeft size={20} />
          <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </motion.button>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 w-full pt-12 md:pt-0">
        
        {/* Cover Art Block */}
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`w-24 h-24 md:w-48 md:h-48 rounded-2xl md:rounded-[1.5rem] bg-gradient-to-br ${style.gradient} border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] md:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center flex-shrink-0 relative overflow-hidden`}
        >
           <div className="absolute inset-0 bg-black/20" />
           <Icon className="w-10 h-10 md:w-24 md:h-24 text-white relative z-10 drop-shadow-2xl opacity-90" strokeWidth={1.5} />
        </motion.div>
        
        {/* Text & Actions */}
        <div className="flex flex-col gap-2 text-center md:text-left flex-1 min-w-0 md:mb-4">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-white/60 mb-1"
          >
            {subtitle || 'Playlist'}
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-none drop-shadow-xl"
          >
            {title}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-4 md:gap-6 mt-2 md:mt-4"
          >
            <p className="text-white/70 font-medium text-xs md:text-sm lg:text-base max-w-xl leading-relaxed drop-shadow-md">
              {description || `${songCount || 0} tracks • Curated for your current vibe`}
            </p>
            
            <div className="flex items-center justify-center md:justify-start gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPlay}
                className={`flex items-center gap-2.5 ${style.buttonBg} px-5 py-2.5 md:px-8 md:py-3.5 rounded-full font-bold text-xs md:text-sm uppercase tracking-wider transition-all ${style.buttonGlow}`}
              >
                <Play size={16} fill="currentColor" className="md:w-[18px] md:h-[18px]" />
                Play Mix
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
