export interface VolumeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function VolumeSlider({ onChange, value }: VolumeSliderProps) {
  return (
    <div className="VolumeSlider">
      cool volume slider
    </div>
  );
}