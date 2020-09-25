import { CardContent } from "framework7-react";
import React from "react";
import { FlexRow } from "../../components/layout";
import RoundedCard from "../../components/RoundedCard";
import { Song } from "./types";
import { animated, useSpring } from "react-spring";
import Colors from "../../colors";

interface Props {
  song: Song;
  onSelect?: (song: Song) => void;
  isPlaying: boolean;
}

const AnimatedRoundedCard = animated(RoundedCard);

const SongCard: React.FC<Props> = ({ song, onSelect, isPlaying }) => {
  const roundedCardColor = useSpring({
    backgroundColor: isPlaying ? Colors.primaryLight : "white",
  });
  return (
    <div onClick={() => onSelect && onSelect(song)}>
      <AnimatedRoundedCard className="ml-0 mr-0" style={roundedCardColor}>
        <CardContent>
          <FlexRow>
            <div
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                width: "64px",
                height: "64px",
                background: `url(${song.image}) no-repeat`,
                backgroundSize: "cover",
              }}
            />
            <div className="ml-3">
              <p className="m-0">
                <strong>{song.name}</strong>
              </p>
              <p className="text-color-gray m-0">{song.artist}</p>
            </div>
          </FlexRow>
        </CardContent>
      </AnimatedRoundedCard>
    </div>
  );
};

export default SongCard;
