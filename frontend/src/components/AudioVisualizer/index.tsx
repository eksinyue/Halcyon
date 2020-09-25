import React, { useEffect, useRef } from "react";
import Wavesurfer from "wavesurfer.js";

interface Props {
  blob: Blob | null;
  height: number;
  color?: string;
  progressColor?: string;
  wavesurfer: WaveSurfer | null;
  readOnly?: boolean;

  setWavesurfer: (wavesurfer: WaveSurfer) => void;
}

const AudioVisualizer: React.FC<Props> = ({
  blob,
  height,
  progressColor,
  color,
  wavesurfer,
  readOnly = false,
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

    if (progressColor) {
      if (!readOnly) {
        wavesurfer.setCursorColor(progressColor);
      } else {
        wavesurfer.setCursorColor("transparent");
      }
      wavesurfer.setProgressColor(progressColor);
    } else {
      // wavesurfer.setCursorWidth(0);
    }
  }, [color, wavesurfer, progressColor, readOnly]);
  useEffect(() => {
    if (!vizRef.current || !blob || wavesurfer) {
      return;
    }
    const instance = Wavesurfer.create({
      container: vizRef.current,
      waveColor: color,
      progressColor: progressColor || color,
      barWidth: 4,
      barRadius: 8,
      cursorWidth: 2,
      height,
      barGap: 0,
    });
    setWavesurfer(instance);
  }, [vizRef, color, height, blob, setWavesurfer, progressColor, wavesurfer]);

  useEffect(() => {
    if (!wavesurfer) {
      return;
    }
    if (!blob) {
      wavesurfer.empty();
    } else {
      wavesurfer.loadBlob(blob);
    }
  }, [wavesurfer, blob]);
  return (
    <div
      ref={vizRef}
      className="fullwidth"
      style={{ pointerEvents: "none", width: "100%", height: height }}
    />
  );
};

export default AudioVisualizer;
