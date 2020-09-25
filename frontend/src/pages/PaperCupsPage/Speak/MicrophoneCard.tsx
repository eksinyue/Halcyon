import styled from "@emotion/styled";
import { Icon } from "framework7-react";
import React, { useCallback, useEffect, useState } from "react";
import { animated, useSpring, useTransition } from "react-spring";
import Colors from "../../../colors";
import AudioVisualizer from "../../../components/AudioVisualizer";
import Recorder from "./Recorder";

interface Props {
  recorder: Recorder;
  setRecorder: (recorder: Recorder) => void;
  setBlob: (blob: Blob | null) => void;
  isRecording: boolean;
  setIsRecording: (b: boolean) => void;
  blob: Blob | null;
  wavesurfer: WaveSurfer | null;
  setWavesurfer: (wavesurfer: WaveSurfer) => void;
}

const MicrophoneCard: React.FC<Props> = ({
  recorder,
  setRecorder,
  setBlob,
  isRecording,
  setIsRecording,
  wavesurfer,
  setWavesurfer,
  blob,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.on("play", () => {
        setIsPlaying(true);
      });
      wavesurfer.on("pause", () => {
        setIsPlaying(false);
      });
      wavesurfer.on("finish", () => {
        setIsPlaying(false);
        wavesurfer.seekTo(0);
      });
      return () => {
        wavesurfer.stop();
      };
    }
  }, [wavesurfer]);
  const startRecording = useCallback(async () => {
    await recorder.init();
    recorder.addOnDataAvailable(() => {
      setBlob(new Blob(recorder.blobs, { type: "audio/mpeg" }));
    });
    await recorder.start();
    setIsRecording(true);
  }, [recorder, setBlob, setIsRecording]);

  const stopRecording = useCallback(() => {
    if (!recorder) {
      return;
    }
    setIsRecording(false);
    recorder.stop();
  }, [recorder, setIsRecording]);

  const playPauseRecording = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  }, [wavesurfer]);

  const boxStyle = useSpring({
    backgroundColor: isRecording ? Colors.primaryLighter : Colors.secondary,
  });
  const micStyle = useSpring({
    color: isRecording ? Colors.secondaryDark : Colors.primaryDark,
  });

  return (
    <MicrophoneBox
      className="p-2 pointer"
      style={boxStyle}
      onClick={
        isRecording
          ? stopRecording
          : !blob
          ? startRecording
          : playPauseRecording
      }
    >
      <animated.div style={micStyle} className="ml-2 mr-2">
        {isRecording ? (
          <Icon f7="stop_fill" />
        ) : blob && !isPlaying ? (
          <Icon f7="play_fill" />
        ) : blob && isPlaying ? (
          <Icon f7="pause_fill" />
        ) : (
          <Icon f7="mic" />
        )}
      </animated.div>
      <div style={{ flexGrow: 1 }}>
        {!isRecording && !blob ? (
          <h2 className="blue-text m-0">Record now</h2>
        ) : isRecording ? (
          <h2 className="blue-text m-0">Recording</h2>
        ) : (
          <AudioVisualizer
            blob={blob}
            wavesurfer={wavesurfer}
            setWavesurfer={setWavesurfer}
            height={64}
            color={Colors.primaryLighter}
            progressColor={Colors.primaryDark}
            readOnly={isRecording}
          />
        )}
      </div>
    </MicrophoneBox>
  );
};

const MicrophoneBox = styled(animated.div)`
  border-radius: 16px;
  min-width: 64px;
  height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export default MicrophoneCard;
