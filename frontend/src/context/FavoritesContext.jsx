import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FavoritesContext = createContext();

export function useFavorites() {
  return useContext(FavoritesContext);
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastId, setToastId] = useState(0);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to parse favorites from local storage", err);
    }
  }, []);

  // Sync to local storage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setToastId(prev => prev + 1); // Used to re-trigger animations if rapidly clicked
  }, []);

  const toggleFavorite = useCallback((song) => {
    if (!song) return;

    // Use _id if available (MongoDB), fallback to audio path
    const uniqueId = song._id || song.audio;

    setFavorites(prev => {
      const exists = prev.some(f => (f._id || f.audio) === uniqueId);
      
      if (exists) {
        return prev.filter(f => (f._id || f.audio) !== uniqueId);
      } else {
        // Only store lightweight metadata
        const lightweightSong = {
          _id: song._id,
          title: song.title,
          artist: song.artist,
          audio: song.audio,
          mood: song.mood
        };
        showToast("Added to Favorites");
        return [...prev, lightweightSong];
      }
    });
  }, [showToast]);

  const isFavorite = useCallback((song) => {
    if (!song) return false;
    const uniqueId = song._id || song.audio;
    return favorites.some(f => (f._id || f.audio) === uniqueId);
  }, [favorites]);

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    toastMessage,
    toastId,
    setToastMessage
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
