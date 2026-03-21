import axios from "axios";
import React, { use } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import "../../css/search/SearchBar.css";

const SearchBar = ({ setSearchSongs }) => {
  const [query, setQuery] = useState("");
  const [loading, setloading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSearchSongs([]);
      return;
    }
    const fetchSongs = async () => {
      try {
        setloading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/songs/playlistByTag/${encodeURIComponent(query)}`,
        );

        setSearchSongs(res.data.results);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchSongs([]);
      } finally {
        setloading(false);
      }
    };
    const debounce = setTimeout(fetchSongs, 400);
    return () => clearInterval(debounce);

    fetchSongs();
  }, [query, setSearchSongs]);

  return (
    <div className="searchbar-root">
      <div className="searchbar-input-wrapper">
        <input
          type="text"
          className="searchbar-input"
          value={query}
          placeholder="Search"
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <CiSearch className="searchbar-icon" size={20} />
      </div>
      {!query && !loading && (
        <p className="searchbar-empty">Search songs to display</p>
      )}
      {loading && <p className="searchbar-loading">Searching...</p>}
    </div>
  );
};

export default SearchBar;
