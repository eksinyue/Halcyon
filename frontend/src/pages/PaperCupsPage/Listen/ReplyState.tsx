import React, { useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import { MutedButton, PinkButton } from "../../../components/CustomButton";
import MicrophoneCard from "../Speak/MicrophoneCard";
import Recorder from "../Speak/Recorder";

interface Props {
  replyBlob: Blob | null;
  setReplyBlob: (blob: Blob | null) => void;
  onReply: () => void;
  loading: boolean;
}

const ReplyState: React.FC<Props> = ({
  replyBlob,
  setReplyBlob,
  onReply,
  loading,
}) => {
  const [recorder, setRecorder] = useState(new Recorder());
  const [isRecording, setIsRecording] = useState(false);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const doneContainerStyle = useSpring({
    opacity: replyBlob ? 1 : 0,
  });

  const onReset = () => {
    recorder.reset();
    setReplyBlob(null);
    setWavesurfer(null);
  };

  useEffect(() => {
    return () => {
      recorder.stop();
    };
  }, [recorder]);

  return (
    <>
      <p className="text-align-center text-2 mb-3">
        <strong>Record your reply</strong>
      </p>
      <MicrophoneCard
        recorder={recorder}
        setRecorder={setRecorder}
        blob={replyBlob}
        setBlob={setReplyBlob}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        wavesurfer={wavesurfer}
        setWavesurfer={setWavesurfer}
      />
      <animated.div style={doneContainerStyle}>
        <PinkButton
          onClick={onReply}
          disabled={isRecording || !replyBlob}
          className="mb-2 mt-2"
          loading={loading}
        >
          Reply
        </PinkButton>
        <MutedButton onClick={onReset}>Reset</MutedButton>
      </animated.div>
    </>
  );
};

export default ReplyState;
