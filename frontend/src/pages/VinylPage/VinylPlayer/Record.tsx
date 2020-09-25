import { keyframes, css } from "@emotion/core";
import styled from "@emotion/styled";
import Colors from "../../../colors";

interface RecordProps {
  image: string;
  playing: boolean;
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const recordCss = css`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const Record = styled.div<RecordProps>`
  ${recordCss}
  background: ${(props) =>
    props.image
      ? `repeating-radial-gradient(transparent, transparent 4px, ${Colors.primaryLighter} 6px), url(${props.image});`
      : Colors.primaryTint};
  background-size: cover;
  animation: ${rotate} 10s linear infinite;
  animation-play-state: ${(props) => (props.playing ? "running" : "paused")};
  cursor: pointer;
`;

export const BlankRecord = styled.div`
  ${recordCss}
  background-color: ${Colors.primaryTint};
`;

export default Record;
