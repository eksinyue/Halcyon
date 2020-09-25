import { keyframes } from "@emotion/core";
import styled from "@emotion/styled";
import { Button, Icon, Link, Toolbar } from "framework7-react";
import React from "react";
import Colors from "../../../colors";
import AudioVisualizer from "../../../components/AudioVisualizer";
import { MutedButton } from "../../../components/CustomButton";
import { FlexRow } from "../../../components/layout";

interface Props {
  isRecording: boolean;
  isPlaying: boolean;
  hasRecording: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onMicPress: () => void;
  onStopRecording: () => void;
  onSend: () => void;
  wavesurfer: WaveSurfer | null;
  setWavesurfer: (w: WaveSurfer) => void;
  blob: Blob | null;
  isSending: boolean;
}

const ChatBox: React.FC<Props> = ({
  onMicPress,
  isRecording,
  isPlaying,
  hasRecording,
  onPlay,
  onPause,
  onReset,
  onStopRecording,
  onSend,
  wavesurfer,
  setWavesurfer,
  isSending,
  blob,
}) => {
  const renderButtonBar = () => {
    if (isRecording) {
      // only show stop
      return (
        <MutedButton onClick={onStopRecording}>
          <Icon f7="stop_fill" />
        </MutedButton>
      );
    } else if (hasRecording && isPlaying) {
      // is playing
      return (
        <MutedButton onClick={onPause}>
          <Icon f7="pause_fill" />
        </MutedButton>
      );
    } else if (hasRecording && !isPlaying) {
      // not playing
      return (
        <MutedButton onClick={onPlay}>
          <Icon f7="play_fill" />
        </MutedButton>
      );
    } else {
      // can record
      return (
        <MutedButton onClick={onMicPress}>
          <Icon f7="mic" />
        </MutedButton>
      );
    }
  };
  return (
    <Toolbar
      position="bottom"
      style={{ backgroundColor: Colors.secondary }}
      className="blue-text"
    >
      <FlexRow className="justify-content-center align-items-center mr-2">
        {renderButtonBar()}
        {!isRecording && hasRecording && !isPlaying ? (
          <MutedButton onClick={onReset}>
            <Icon f7="multiply" />
          </MutedButton>
        ) : (
          <MutedButton disabled>
            <Icon f7="multiply" style={{ color: "transparent" }} />
          </MutedButton>
        )}
      </FlexRow>
      <AudioVisualizer
        blob={blob}
        height={36}
        wavesurfer={wavesurfer}
        setWavesurfer={setWavesurfer}
        color={Colors.secondaryLight}
        progressColor={Colors.secondaryDark}
      />
      {isSending ? (
        <RotatingIcon f7="arrow_clockwise" />
      ) : hasRecording && !isRecording ? (
        <Button onClick={onSend} className="mr-2 ml-2">
          <Icon f7="paperplane_fill" />
        </Button>
      ) : null}
      <Link popoverOpen=".popover-menu">
        <Icon f7="ellipsis_vertical" />
      </Link>
    </Toolbar>
  );
};

const rotateKeyframes = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const RotatingIcon = styled(Icon)`
  animation: ${rotateKeyframes} 3s linear infinite;
`;
export default ChatBox;
