import React, { useEffect, useState } from "react";
import { FiShuffle } from "react-icons/fi";

interface ShuffleProps {
  onClick: () => void;
}

const Shuffle: React.FC<ShuffleProps> = ({ onClick }) => {
  const storedState = localStorage.getItem("shuffleState");
  const [isGreen, setIsGreen] = useState(storedState === "true");

  const handleClick = () => {
    const newIsGreen = !isGreen;
    localStorage.setItem("shuffleState", String(newIsGreen));
    setIsGreen(newIsGreen);
    onClick();
  };

  useEffect(() => {
    console.log("isGreen:", isGreen);
    console.log("storedState:", storedState);
  }, [isGreen, storedState]);

  return (
    <FiShuffle
      onClick={handleClick}
      size={15}
      className={`${
        isGreen ? "text-green-500" : "text-neutral-400"
      } cursor-pointer`}
    />
  );
};

export default Shuffle;
