import styled from "@emotion/styled";
import { Icon } from "framework7-react";
import React, { useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import Colors from "../../../colors";
import AudioVisualizerURL from "../../../components/AudioVisualizerURL";
import { MutedButton, PinkButton } from "../../../components/CustomButton";

interface Props {
  setListened: (b: boolean) => void;
  listened: boolean;
  url?: string;
  chooseAnother: () => void;
  wavesurfer: WaveSurfer | null;
  setWavesurfer: (wavesurfer: WaveSurfer) => void;
  onReply: () => void;
  loading: boolean;
}

const ListeningState: React.FC<Props> = ({
  setListened,
  listened,
  url,
  chooseAnother,
  wavesurfer,
  setWavesurfer,
  onReply,
  loading,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    if (!wavesurfer) {
      return;
    }
    const inst = wavesurfer;
    inst.on("play", () => {
      setIsPlaying(true);
    });
    inst.on("pause", () => {
      setIsPlaying(false);
    });
    inst.on("finish", () => {
      setIsPlaying(false);
      setListened(true);
      inst.seekTo(0);
    });
  }, [wavesurfer, setListened, setIsPlaying]);

  const listenStyle = useSpring({
    height: listened ? "0px" : "40px",
  });
  return (
    <>
      <SoundBox
        style={{ backgroundColor: Colors.secondary }}
        className="pl-3 pr-3 pt-2 pb-2 pointer"
        onClick={() => {
          if (wavesurfer) {
            wavesurfer.playPause();
          }
        }}
      >
        <div className="mr-2" onClick={() => {}}>
          {isPlaying ? <Icon f7="pause_fill" /> : <Icon f7="play_fill" />}
        </div>
        <AudioVisualizerURL
          url={url}
          color={Colors.primaryLighter}
          progressColor={Colors.primaryDark}
          height={64}
          wavesurfer={wavesurfer}
          setWavesurfer={setWavesurfer}
        />
      </SoundBox>
      <div className="mt-2" style={{ margin: "16px auto" }}>
        <animated.div style={listenStyle}>
          <p>You can reply after listening to what your friend has to say!</p>
        </animated.div>
        <PinkButton className="mb-2" disabled={!listened} onClick={onReply}>
          Reply
        </PinkButton>
        <MutedButton onClick={chooseAnother}>Choose another</MutedButton>
      </div>
    </>
  );
};

const SoundBox = styled(animated.div)`
  border-radius: 16px;
  min-width: 64px;
  height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export default ListeningState;
