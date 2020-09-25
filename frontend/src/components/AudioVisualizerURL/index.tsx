import React, { useEffect, useRef } from "react";
import Wavesurfer from "wavesurfer.js";

interface Props {
  url?: string;
  height: number;
  color?: string;
  progressColor?: string;
  wavesurfer: WaveSurfer | null;
  setWavesurfer: (wavesurfer: WaveSurfer) => void;
}

const AudioVisualizerURL: React.FC<Props> = ({
  url,
  height,
  color,
  progressColor,
  wavesurfer,
  setWavesurfer,
}) => {
  const vizRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!wavesurfer) {
      return;
    }
    if (color) {
      wavesurfer.setWaveColor(color);
    }
    wavesurfer.setProgressColor(progressColor || color);
    if (progressColor) {
      wavesurfer.setCursorColor(progressColor);
    } else {
      // wavesurfer.setCursorWidth(0);
    }
  }, [color, wavesurfer, progressColor]);
  useEffect(() => {
    if (!vizRef.current || !url) {
      return;
    }
    const instance = Wavesurfer.create({
      container: vizRef.current,
      waveColor: color,
      progressColor: progressColor || color,
      cursorColor: progressColor || color,
      barWidth: 4,
      barRadius: 8,
      cursorWidth: 2,
      height,
      barGap: 0,
    });
    setWavesurfer(instance);
    instance.load(url);
  }, [vizRef, color, height, progressColor, setWavesurfer, url]);

  return (
    <div className="fullwidth fullheight">
      <div
        ref={vizRef}
        className="fullwidth"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
};

export default AudioVisualizerURL;
