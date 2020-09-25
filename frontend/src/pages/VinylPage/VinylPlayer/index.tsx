import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";
import { useTransition } from "react-spring";
import Colors from "../../../colors";
import MusicPlayer from "../../../music/MusicPlayer";
import { Song } from "../types";
import { forNotSmall, forSmall } from "./helpers";
import Record, { BlankRecord } from "./Record";
import RecordContainer from "./RecordContainer";

interface Props {
  isPlaying: boolean;
  song?: Song;
}

const VinylPlayer: React.FC<Props> = ({ isPlaying, song }) => {
  const transitions = useTransition(song, (song) => song?.id || -1, {
    from: { opacity: 0, transform: "translate3d(-10%, -50%, 0)" },
    enter: { opacity: 1, transform: "translate3d(-10%, 0, 0)" },
    leave: { opacity: 0, transform: "translate3d(-10%, -50%, 0)" },
    unique: true,
  });

  const toggle = () => {
    if (MusicPlayer.isPlaying) {
      MusicPlayer.pause();
    } else {
      MusicPlayer.resume();
    }
  };
  return (
    <VinylPlayerContainer>
      <VinylTurner />
      <OtherStuffContainer>
        <PlayPauseButton active={isPlaying} onClick={toggle} />
      </OtherStuffContainer>
      <RecordContainer>
        <BlankRecord>
          <InnerPart size="48" color={Colors.primary} />
        </BlankRecord>
      </RecordContainer>
      {song &&
        transitions.map(({ item, props, key }) => {
          return (
            <RecordContainer style={props} key={item?.id || -1}>
              <Record
                image={item?.image || ""}
                playing={isPlaying}
                onClick={toggle}
              >
                <InnerPart size="48" color={Colors.primary} />
              </Record>
            </RecordContainer>
          );
        })}
    </VinylPlayerContainer>
  );
};

const VinylPlayerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 6px ${Colors.primaryTint};
  background: ${Colors.primary};
  ${forSmall(css`
    height: 250px;
  `)}
  ${forNotSmall(css`
    height: 300px;
  `)}
`;

interface InnerPartProps {
  size: string | number;
  color: string;
}

const InnerPart = styled.div<InnerPartProps>`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const VinylTurner = styled.div`
  position: absolute;
  width: 55px;
  height: 10px;
  background-color: ${Colors.primaryLight};
  box-shadow: 0 6px ${Colors.primary};
  left: 50%;
  top: 50%;
  border-radius: 8px 0px 0px 8px;
  z-index: 10;
  ${forSmall(css`
    transform: translate(40px, -50%);
  `)}
  ${forNotSmall(css`
    transform: translate(60px, -50%);
  `)}
`;

const OtherStuffContainer = styled.div`
  display: flex;
  position: absolute;
  bottom: 0px;
  right: 0px;
  height: 100%;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-right: 16px;
  box-sizing: border-box;
`;

const PlayPauseButton = styled.a<{ active: boolean }>`
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${Colors.primaryLight};
  box-shadow: ${(props) => (props.active ? "0px 0px" : "2px 2px")}
    ${Colors.primaryDark};
  transform: ${(props) => (props.active ? "translateY(2px)" : "")};
`;

export default VinylPlayer;
