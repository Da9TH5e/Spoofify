"use client";

import * as RadixSlider from "@radix-ui/react-slider";

interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ value = 1, onChange }) => {
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
        group
        h-10
        "
      defaultValue={[value]}
      value={[value]}
      onValueChange={handleChange}
      max={1}
      step={0.001}
      aria-label="Volume"
    >
      <RadixSlider.Track
        className="
            bg-neutral-600
            relative
            grow
            rounded-full
            h-[3px]
            group-hover:h-[5px]
            transtition
            duration-200
            ease-in-out
            "
      >
        <RadixSlider.Range
          className="
            absolute 
            rounded-full 
            bg-white
            group-hover:bg-green-600
            h-full 
            transition 
            duration-200
            ease-in-out
            "
        />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className="
            hidden
            w-3
            h-3
            group-hover:block
            bg-white
            border-white
            rounded-full
            focus:outline-none
            transition
            duration-200
            ease-in-out
            "
      />
    </RadixSlider.Root>
  );
};

export default Slider;
