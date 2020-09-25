import React from "react";
import { css, keyframes } from "@emotion/core";
import styled from "@emotion/styled";
import { Link } from "framework7-react";
import VinylImage from "../../assets/vinyl_blue.png";
import { forNotSmall, forSmall, strokeOutline } from "./css-helpers";

const playingKeyframes = keyframes`
  from {
    transform: skew(3deg, 0deg);
  }

  to {
    transform: skew(-3deg, 0deg);
  }
`;

const InnerVinyl = styled.div<{ isPlaying: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  background: url(${VinylImage}) no-repeat;
  background-size: 100% 100%;
  transform-origin: center bottom;
  ${(props) =>
    props.isPlaying
      ? css`
          animation: ${playingKeyframes} 1s infinite linear alternate;
        `
      : ""}
  ${strokeOutline}
`;

const VinylContainer = styled(Link)`
  display: block;
  position: absolute;
  left: 15%;
  transform: translate(0, -70%);

  ${forSmall(css`
    width: 160px;
    height: 130px;
  `)}

  ${forNotSmall(css`
    width: 240px;
    height: 180px;
    top: 4%;
  `)}
`;

const MusicNotesContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 80px;
  transform: translate(-50%, -70%);
`;

const NoteKeyframes = keyframes`
  0% {
    transform: scale(1) translate(-50%, 0);
    opacity: 0;
  }
  50% {
    opacity: 1;
    transform: scale(1.2) translate(0%, -50%);
  }
  80% {
    opacity: 0;
    transform: scale(1.3) translate(50%, -100%);
  }
  100% {
    transform: scale(1) translate(50%, -100%);
    opacity: 0;
  }
`;

const MusicNote = styled.div<{ left: number; delay: number; duration: number }>`
  position: absolute;
  bottom: 0px;
  left: ${(props) => props.left}px;
  font-size: 40px;
  transform: translate(-50%, -0%);
  animation: ${NoteKeyframes} ${(props) => props.duration}s infinite linear;
  animation-delay: ${(props) => props.delay}s;
`;

const notes = [
  {
    left: 20,
    note: `♩`,
    delay: 0,
    animation: 3,
  },
  {
    left: 50,
    note: `♩`,
    delay: 0.5,
    animation: 2.3,
  },
  {
    left: 80,
    note: `♬`,
    delay: 0.8,
    animation: 2.8,
  },
  {
    left: 35,
    note: `♫`,
    delay: 0.3,
    animation: 2.6,
  },
  {
    left: 65,
    note: `♪`,
    delay: 1.3,
    animation: 3.5,
  },
];

const Vinyl: React.FC<Link.Props & { isPlaying: boolean }> = ({
  isPlaying,
  ...props
}) => {
  return (
    <VinylContainer {...props}>
      <InnerVinyl isPlaying={isPlaying} />
      {isPlaying ? (
        <MusicNotesContainer className="blue-text">
          {notes.map(({ left, delay, note, animation }) => (
            <MusicNote
              left={left}
              key={left}
              delay={delay}
              duration={animation}
            >
              {note}
            </MusicNote>
          ))}
        </MusicNotesContainer>
      ) : null}
    </VinylContainer>
  );
};

export default Vinyl;
