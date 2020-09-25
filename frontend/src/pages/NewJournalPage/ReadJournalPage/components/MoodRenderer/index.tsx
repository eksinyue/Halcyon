import styled from "@emotion/styled";
import React from "react";
import MoodIcons from "../../../../../components/MoodIcons";
import { Mood } from "../../../types";

interface Props {
  mood: Mood;
  size?: number;
  style?: { [x: string]: any };
}

const Image = styled.img<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;

const MoodRenderer: React.FC<Props> = ({ mood, size = 32, style }) => {
  switch (mood) {
    case Mood.Happy:
      return (
        <Image size={size} src={MoodIcons.Happy} alt="happy" style={style} />
      );
    case Mood.Sad:
      return <Image size={size} src={MoodIcons.Sad} alt="sad" style={style} />;
    case Mood.Angry:
      return (
        <Image size={size} src={MoodIcons.Angry} alt="angry" style={style} />
      );
    case Mood.Tired:
      return (
        <Image size={size} src={MoodIcons.Tired} alt="tired" style={style} />
      );
    case Mood.Stressed:
      return (
        <Image
          size={size}
          src={MoodIcons.Stressed}
          alt="stressed"
          style={style}
        />
      );
    case Mood.Relaxed:
      return (
        <Image
          size={size}
          src={MoodIcons.Relaxed}
          alt="relaxed"
          style={style}
        />
      );
    default:
      return null;
  }
};

export default MoodRenderer;
