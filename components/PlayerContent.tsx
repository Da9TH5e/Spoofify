"use client";

import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import Shuffle from "./Shuffle";
import Repeat from "./Repeat";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { BsFillSkipEndFill, BsFillSkipStartFill } from "react-icons/bs";
import { TbVolume, TbVolume2, TbVolume3 } from "react-icons/tb";
import Slider from "./Slider";
import MusicSlider from "./MusicSlider";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import React from "react";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

interface VolumeIconProps {
  onClick?: () => void;
  className?: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const arrayCopy = [...array];
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  console.log("Shuffled Array:", arrayCopy);
  return arrayCopy;
}

function customCompare(a: any, b: any): number {
  const valueA = typeof a === "object" ? JSON.stringify(a) : a;
  const valueB = typeof b === "object" ? JSON.stringify(b) : b;
  if (valueA > valueB) {
    return -1;
  } else if (valueA < valueB) {
    return 1;
  } else {
    return 0;
  }
}

function nonShuffleArray<T>(array: T[]): T[] {
  const arrayCopy = [...array];
  arrayCopy.sort(customCompare);
  console.log("NonShuffled Array:", arrayCopy);
  return arrayCopy;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songProgress, setSongProgress] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  useEffect(() => {
    console.log("isShuffle :", isShuffle);
  }, [isShuffle]);

  useEffect(() => {
    const storedIsShuffle = localStorage.getItem("isShuffle");
    setIsShuffle(storedIsShuffle === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("isShuffle", isShuffle.toString());
  }, [isShuffle]);

  const toggleShuffle = () => {
    setIsShuffle((prevIsShuffle) => {
      const newIsShuffle = !prevIsShuffle;
      localStorage.setItem("isShuffle", newIsShuffle.toString());
      return newIsShuffle;
    });
  };

  const shuffle = () => {
    if (!isShuffle) {
      const shuffledIds = shuffleArray(player.ids);
      player.setIds(shuffledIds);
      console.log("Shuffling is on");
    } else {
      const nonShuffledIds = nonShuffleArray(player.ids);
      player.setIds(nonShuffledIds);
      console.log("Shuffling is off");
    }
    toggleShuffle();
  };

  useEffect(() => {
    console.log("isRepeat :", isRepeat);
  }, [isRepeat]);

  useEffect(() => {
    const storedIsRepeat = localStorage.getItem("isRepeat");
    setIsRepeat(storedIsRepeat === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("isRepeat", isRepeat.toString());
  }, [isRepeat]);

  const onRepeat = () => {
    const storedIntervalId = localStorage.getItem("repeatIntervalId");
    if (!isRepeat) {
      const repeatSongId = player.activeId ?? "";
      const intervalId = setInterval(() => {
        player.setId(repeatSongId);
      }, 1000);
      localStorage.setItem("repeatIntervalId", String(intervalId));
      console.log("Setting Repeat Interval ID:", intervalId);
      console.log("Stored Interval ID:", storedIntervalId);
      setIsRepeat(true);
    } else if (isRepeat) {
      const intervalId = Number(storedIntervalId);
      clearInterval(intervalId);
      localStorage.removeItem("repeatIntervalId");
      console.log("Clearing Repeat Interval ID:", intervalId);
      setIsRepeat(false);
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon: React.FC<VolumeIconProps> = ({ onClick, className }) => {
    const getVolumeIcon = (): React.ReactNode => {
      if (volume === 0) {
        return <TbVolume3 size={22} />;
      } else if (volume > 0.7) {
        return <TbVolume size={22} />;
      } else {
        return <TbVolume2 size={22} />;
      }
    };
    const handleClick = () => {
      if (onClick) {
        onClick();
      }
    };

    return (
      <div onClick={handleClick} className={className}>
        {getVolumeIcon()}
      </div>
    );
  };

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    setSongProgress(0);
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    if (isRepeat) {
      if (player.activeId !== undefined) {
        player.setId(player.activeId);
        console.log("Next Song is :", player.activeId);
      }
    } else {
      const nextIndex = (currentIndex + 1) % player.ids.length;
      player.setId(player.ids[nextIndex]);
    }
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    setSongProgress(0);
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  };

  const [play, { pause, sound }] = useSound(songUrl, {
    volume: volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
    },
    onpause: () => setIsPlaying(false),
    format: ["mp3"],
  });

  useEffect(() => {
    sound?.play();
    const updateProgress = () => {
      const currentProgress = (sound?.seek() || 0) / (sound?.duration() || 1);
      setSongProgress(currentProgress);
    };

    const intervalId = setInterval(updateProgress, 1000);

    return () => {
      clearInterval(intervalId);
      sound?.unload();
    };
  }, [sound]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div
        className="
                    flex
                    w-full
                    justify-start
                    "
      >
        <div className="flex items-center gap-x-4 truncate max-w-[20rem]">
          <MediaItem data={song} />
        </div>
        <div className="flex items-center gap-x-4 truncate">
          <LikeButton songId={song.id} />
        </div>
      </div>

      <div
        className="
                    flex
                    md:hidden
                    col-auto
                    w-full
                    justify-end
                    items-center
                    "
      >
        <div
          onClick={handlePlay}
          className="
                        h-10
                        w-10
                        flex
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        p-1
                        cursor-pointer
                        "
        >
          <Icon size={30} className="text-black" />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="h-8" style={{ transition: "all 0.1s ease" }}>
          <MusicSlider
            value={songProgress}
            onChange={(value) => {
              const newProgress = value * (sound?.duration() || 0);
              sound?.seek(newProgress);
              setSongProgress(value);
            }}
            maxDuration={1}
          />
        </div>

        <div
          className="
                        hidden
                        md:flex
                        h-full
                        items-center
                        justify-center
                        w-full
                        max-w-[722px]
                        gap-x-6
                        "
        >
          <Shuffle onClick={shuffle} />
          <BsFillSkipStartFill
            onClick={onPlayPrevious}
            size={30}
            className="
                            text-neutral-400
                            cursor-pointer
                            hover:text-white
                            transition
                            "
          />
          <div
            onClick={handlePlay}
            className="
                            h-10
                            w-10
                            flex
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                            p-1
                            cursor-pointer
                            "
          >
            <Icon size={30} className="text-black" />
          </div>
          <BsFillSkipEndFill
            onClick={onPlayNext}
            size={30}
            className="
                            text-neutral-400
                            cursor-pointer
                            hover:text-white
                            transtition
                            "
          />
          <Repeat onClick={onRepeat} />
        </div>
      </div>

      <div className="hidden md:flex w-full justify-end pr-2">
        <div
          className="flex items-center gap-x-2 w-[120px]"
          style={{ transition: "all 0.3s ease" }}
        >
          <VolumeIcon onClick={toggleMute} className="cursor-pointer" />
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
