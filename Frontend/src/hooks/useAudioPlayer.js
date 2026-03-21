import { current } from "@reduxjs/toolkit";
import { useState } from "react";
import { useReducer, useRef } from "react";

const initialAudioState = {
  isPlaying: false,
  isLoading: false,
  isMuted: false,
  volume: 1,
  loopEnabled: false,
  shuffleEnabled: false,
  playbackSpeed: 1,
  currentIndex: null,
  currentSong: null,
  currentTime: 0,
};

//reducers

function audioReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, isLoading: true };
    case "PLAY":
      return { ...state, isPlaying: true, isLoading: false };
    case "PAUSE":
      return { ...state, isPlaying: false };
    case "MUTE":
      return { ...state, isMuted: true };
    case "UNMUTE":
      return { ...state, isMuted: false };
    case "SET_VOLUME":
      return { ...state, volume: action.payload };
    case "TOGGLE_LOOP":
      return {
        ...state,
        loopEnabled: !state.loopEnabled,
        shuffleEnabled: false,
      };
    case "TOGGLE_SHUFFLE":
      return {
        ...state,
        shuffleEnabled: !state.shuffleEnabled,
        loopEnabled: false,
      };
    case "SET_PLAYBACK_SPEED":
      return { ...state, playbackSpeed: action.payload };
    case "SET_CURRENT_TRACK":
      return {
        ...state,
        currentIndex: action.payload.index,
        currentSong: action.payload.song,
        isLoading: true,
      };
    case "SET_CURRENT_TIME":
      return { ...state, currentTime: action.payload };
    default:
      return state;
  }
}

const useAudioPlayer = (songs) => {
  const [audioState, dispatch] = useReducer(audioReducer, initialAudioState);

  const [duration, setduration] = useState(0);
  const previousVolumeref = useRef(1);
  const audioRef = useRef(null);

  //play a song at specific index value
  const playSongAtIndex = (index) => {
    if (!songs || songs.length === 0) {
      console.warn("No songs available to play.");
      return;
    }

    if (index < 0 || index >= songs.length) {
      return;
    }

    const song = songs[index];
    dispatch({ type: "SET_CURRENT_TRACK", payload: { index, song } });
    dispatch({ type: "SET_CURRENT_TIME", payload: 0 });

    const audio = audioRef.current;
    if (!audio) return;
    dispatch({ type: "LOADING" });
    audio.load();

    audio.playbackRate = audioState.playbackSpeed;
    audio
      .play()
      .then(() => dispatch({ type: "PLAY" }))
      .catch((error) => console.error("Play error", error));
  };

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => dispatch({ type: "PLAY" }))
        .catch((error) => console.error("Play error", error));
    } else {
      audio.pause();
      dispatch({ type: "PAUSE" });
    }
  };

  //next song
  const handleNext = () => {
    if (!songs.length) return;

    if (audioState.currentIndex === null) {
      playSongAtIndex(0);
      return;
    }

    //if suffle is enabled
    if (audioState.shuffleEnabled && songs.length > 1) {
      let randomIndex = audioState.currentIndex;
      while (randomIndex === audioState.currentIndex) {
        randomIndex = Math.floor(Math.random() * songs.length);
      }
      playSongAtIndex(randomIndex);
      return;
    }

    //without shuffle
    const nextIndex = (audioState.currentIndex + 1) % songs.length;
    playSongAtIndex(nextIndex);
  };

  const handlePrev = () => {
    if (!songs.length) return;

    if (audioState.currentIndex === null) {
      playSongAtIndex(0);
      return;
    }

    const prevIndex =
      (audioState.currentIndex - 1 + songs.length) % songs.length;
    playSongAtIndex(prevIndex);

    //audio event handler
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    dispatch({ type: "SET_CURRENT_TIME", payload: audio.currentTime });
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setduration(audio.duration || 0);
    audio.playbackRate = audioState.playbackSpeed;
    audio.volume = audioState.volume;
    audio.muted = audioState.isMuted;
    dispatch({ type: "PlAY" });
  };

  const handleEnded = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audioState.loopEnabled) {
      audio.currentTime = 0;
      audio
        .play()
        .then(() => {
          dispatch({ type: "PLAY" });
          dispatch({ type: "SET_CURRENT_TIME", payload: 0 });
        })
        .catch((error) => console.error("Replay error", error));
    } else {
      handleNext();
    }
  };

  const handleToggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audioState.isMuted) {
      const restorevolume = previousVolumeref.current || 1;
      audio.muted = false;
      audio.volume = restorevolume;

      dispatch({ type: "UNMUTE" });
      dispatch({ type: "SET_VOLUME", payload: restorevolume });
    } else {
      previousVolumeref.current = audio.volume || 1;
      audio.muted = true;
      audio.volume = 0;

      dispatch({ type: "MUTE" });
      dispatch({ type: "SET_VOLUME", payload: 0 });
    }
  };

  const handleToggleLoop = () => {
    dispatch({ type: "TOGGLE_LOOP" });
  };

  const handleToggleShuffle = () => {
    dispatch({ type: "TOGGLE_SHUFFLE" });
  };

  const handleChangeSpeed = (newSpeed) => {
    const audio = audioRef.current;
    dispatch({ type: "SET_PLAYBACK_SPEED", payload: newSpeed });
    if (audio) {
      audio.playbackRate = newSpeed;
    }
  };

  const handleSeek = (newTime) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = newTime;
    dispatch({ type: "SET_CURRENT_TIME", payload: newTime });
  };

  const handleChangeVolume = (newVolume) => {
    const audio = audioRef.current;

    if (newVolume > 0) {
      previousVolumeref.current = newVolume;
    }
    dispatch({ type: "SET_VOLUME", payload: newVolume });
    if (!audio) return;
    audio.volume = newVolume;

    if (newVolume === 0) {
      audio.muted = true;
    } else if (audioState.isMuted) {
      audio.muted = false;
      dispatch({ type: "UNMUTE" });
    }
  };
  return {
    //Audio Ref
    audioRef,
    //Current song state
    currentIndex: audioState.currentIndex,
    currentSong: audioState.currentSong,
    isPlaying: audioState.isPlaying,
    currentTime: audioState.currentTime,
    isLoading: audioState.isLoading,
    duration,

    //features Toggles
    isMuted: audioState.isMuted,
    volume: audioState.volume,
    loopEnabled: audioState.loopEnabled,
    shuffleEnabled: audioState.shuffleEnabled,
    playbackSpeed: audioState.playbackSpeed,

    //Playback control functions
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,

    //Audio event handlers
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,

    //Feature control functions
    handleToggleMute,
    handleToggleLoop,
    handleToggleShuffle,
    handleChangeSpeed,
    handleSeek,
    handleChangeVolume,
  };
};

export default useAudioPlayer;
