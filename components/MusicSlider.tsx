// MusicSlider.tsx

import * as RadixSlider from "@radix-ui/react-slider";

interface MusicSliderProps {
  value?: number;
  onChange?: (value: number) => void;
  maxDuration: number;
}

const MusicSlider: React.FC<MusicSliderProps> = ({
  value = 0,
  onChange,
  maxDuration,
}) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };

  return (
    <RadixSlider.Root
      className="
        relative
        flex
        items-center
        touch-none
        select-none
        w-full
        h-10
      "
      defaultValue={[0]}
      value={[value]}
      onValueChange={handleChange}
      max={maxDuration}
      step={0.001}
      aria-label="Music Duration"
    >
      <RadixSlider.Track
        className="
          bg-neutral-600
          relative
          grow
          rounded-full
          h-[3px]
          hover:h-[7px]
          transition
          duration-500
          ease-in-out
        "
      >
        <RadixSlider.Range
          className="
            absolute
            rounded-full
            bg-white
            h-full
            transition-all
            duration-500
          "
        />
      </RadixSlider.Track>
    </RadixSlider.Root>
  );
};

export default MusicSlider;
