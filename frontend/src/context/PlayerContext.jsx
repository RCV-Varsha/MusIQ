import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';

const PlayerContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function usePlayer() {
  return useContext(PlayerContext);
}

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  
  const [queue, setQueue] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      const stored = localStorage.getItem('recentlyPlayed');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  
  // To handle play race conditions
  const playAbortController = useRef(null);

  const currentSong = currentSongIndex >= 0 && currentSongIndex < queue.length 
    ? queue[currentSongIndex] 
    : null;

  const playSong = useCallback(async (index, newQueue = null) => {
    if (newQueue) setQueue(newQueue);
    const activeQueue = newQueue || queue;
    
    if (index < 0 || index >= activeQueue.length) return;
    
    setCurrentSongIndex(index);
    const song = activeQueue[index];

    // Track recently played
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => (s._id || s.audio) !== (song._id || song.audio));
      const updated = [song, ...filtered].slice(0, 20);
      return updated;
    });
    
    if (!song.audio) {
      console.error("No audio URL for song:", song.title);
      return;
    }

    // Cancel any pending play requests
    if (playAbortController.current) {
      playAbortController.current.abort();
    }
    const abortController = new AbortController();
    playAbortController.current = abortController;

    try {
      const audio = audioRef.current;
      audio.pause();
      setIsPlaying(false);
      
      let audioUrl = song.audio;
      if (audioUrl && !audioUrl.startsWith('http') && !audioUrl.startsWith('blob:')) {
        const API_BASE = import.meta.env.VITE_API_BASE_URL;
        let normalizedPath = audioUrl.replace(/\\/g, "/");
        if (normalizedPath.startsWith('/')) {
            normalizedPath = normalizedPath.substring(1);
        }
        audioUrl = `${API_BASE}/${normalizedPath}`;
      }
      
      audio.src = audioUrl;
      
      if (!audio.src) {
        console.error("Audio src is empty after assignment.");
        return;
      }
      
      audio.load();
      
      if (abortController.signal.aborted) return;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (!abortController.signal.aborted) {
            setIsPlaying(true);
          }
        }).catch((err) => {
          if (err.name !== 'AbortError') {
            console.error("Play error caught:", err);
            setIsPlaying(false);
          }
        });
      } else {
         setIsPlaying(true);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error("Synchronous Play error:", err);
        setIsPlaying(false);
      }
    }
  }, [queue]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentSong) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Resume play error:", err);
      });
    }
  }, [isPlaying, currentSong]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    
    let nextIndex = currentSongIndex + 1;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (nextIndex >= queue.length) {
      nextIndex = 0; // Loop back to start
    }
    
    playSong(nextIndex);
  }, [currentSongIndex, queue, isShuffle, playSong]);

  const playPrev = useCallback(() => {
    if (queue.length === 0) return;
    let prevIndex = currentSongIndex - 1;
    if (prevIndex < 0) prevIndex = queue.length - 1;
    playSong(prevIndex);
  }, [currentSongIndex, queue, playSong]);

  const seek = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Cleanup listeners on unmount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(e => console.warn("Auto-play repeat failed:", e));
      } else {
        playNext();
      }
    };
    const handleError = (e) => {
      console.error("Audio playback error caught in global listener. src:", audio.src, "error:", e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [isRepeat, queue.length, currentSongIndex, playNext]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  const value = {
    audioRef,
    queue,
    setQueue,
    currentSong,
    currentSongIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    isShuffle,
    setIsShuffle,
    isRepeat,
    setIsRepeat,
    playSong,
    togglePlay,
    playNext,
    playPrev,
    seek,
    recentlyPlayed
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </PlayerContext.Provider>
  );
}
