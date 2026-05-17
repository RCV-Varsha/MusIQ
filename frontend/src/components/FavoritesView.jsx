import React, { useEffect } from "react";
import { Heart, Music } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { useFavorites } from "../context/FavoritesContext";
import SongRow from "./SongRow";
import PlaylistView from "./PlaylistView";

export default function FavoritesView() {
  const { favorites } = useFavorites();

  return (
    <PlaylistView 
      title="Your Favorites"
      subtitle="Collection"
      description="Every track you've hearted, all in one place."
      songs={favorites}
      icon={Heart}
      color="brand"
    />
  );
}
