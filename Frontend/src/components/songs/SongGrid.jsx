import React from "react";
import SongCard from "./SongCard";
import "../../css/songs/SongGrid.css";

const SongGrid = ({ songs, onSelectFavourite }) => {
  if (!songs || songs.length === 0) {
    return (
      <div className="song-grid-empty">
        <p className="empty-text">No songs to display</p>
        <p className="empty-subtext">
          Start exploaring and add songs to favourites
        </p>
      </div>
    );
  }

  return (
    <div className="song-grid-wrapper">
      <h2 className="song-grid-heading">Favourites</h2>
      <div className="song-grid">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onSelectFavourite={() => onSelectFavourite(song)}
          />
        ))}
      </div>
    </div>
  );
};

export default SongGrid;
