import React, { useEffect, useState } from "react";
import Chair from "./Chair";
import Diary from "./Diary";
import HalcyonBird from "./HalcyonBird";
import Lights from "./Lights";
import MiscItemsHolder from "./MiscItemsHolder";
import NamePlate from "./NamePlate";
import PaperCups from "./PaperCups";
import Plants from "./Plants";
import Carpet from "./Carpet";
import Table from "./Table";
import Vinyl from "./Vinyl";
import Window from "./Window";
import styled from "@emotion/styled";
import MusicPlayer from "../../../../music/MusicPlayer";
import ChirpSFX from "../../sfx/chirp.mp3";
import WoodKnockSFX from "../../sfx/wood_knock.mp3";
import SFXPlayer from "../../../../music/SFXPlayer";
import Colors from "../../../../colors";
import { getHours } from "date-fns";
import { f7 } from "framework7-react";

const RoomLayout = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    setIsPlaying(MusicPlayer.isPlaying);
    const id = MusicPlayer.onStateChange((state) => {
      if (state === "play") {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    });
    return () => {
      MusicPlayer.removeOnStateChange(id);
    };
  }, []);
  const hours = getHours(new Date());
  const dark = hours <= 4 || hours >= 18;
  return (
    <RootLayout dark={dark}>
      <Window dark={dark}>
        <HalcyonBird
          onClick={() => {
            SFXPlayer.play(ChirpSFX);
            f7.views.main.router.navigate("/about");
          }}
        />
        <PaperCups href="/papercups" />
      </Window>
      <NamePlate />
      <Lights />
      <Plants onClick={() => SFXPlayer.play(WoodKnockSFX)} />
      <Carpet />
      <Table>
        <MiscItemsHolder />
        <Vinyl href="/vinyl" isPlaying={isPlaying} />
        <Diary href="/journal" />
      </Table>
      <Chair />
    </RootLayout>
  );
};

const RootLayout = styled.div<{ dark: boolean }>`
  position: relative;
  width: 100vw;
  min-height: 800px;
  height: 100vh;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: ${(props) =>
    props.dark ? "#e6dcd2" : Colors.tertiaryLight};
  transition: 0.5s all;
`;

export default RoomLayout;
