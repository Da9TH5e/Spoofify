import React, { useEffect, useState } from "react";
import { FiRepeat } from "react-icons/fi";

interface RepeatProps {
  onClick: () => void;
}

const Repeat: React.FC<RepeatProps> = ({ onClick }) => {
  const storedState = localStorage.getItem("repeatState");
  const [isRepeat, setIsRepeat] = useState(storedState === "true");

  const handleClick = () => {
    const newIsRepeat = !isRepeat;
    localStorage.setItem("repeatState", String(newIsRepeat));
    setIsRepeat(newIsRepeat);
    onClick();
  };

  useEffect(() => {
    console.log("isRepeat:", isRepeat);
    console.log("storedState:", storedState);
  }, [isRepeat, storedState]);

  return (
    <FiRepeat
      onClick={handleClick}
      size={15}
      className={`${
        isRepeat ? "text-green-500" : "text-neutral-400"
      } cursor-pointer`}
    />
  );
};

export default Repeat;
