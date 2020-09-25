import SerenityMP3 from "../../music/Serenity.mp3";
import SerenityPNG from "../../music/serenity.png";
import TranquilityMP3 from "../../music/Tranquility.mp3";
import TranquilityPNG from "../../music/tranquility.png";
import BiscuitMP3 from "../../music/Biscuit.mp3";
import BiscuitJPG from "../../music/Biscuit.jpg";
import TakeCareMP3 from "../../music/TakeCare.mp3";
import TakeCarePNG from "../../music/TakeCare.png";
import StorybookMP3 from "../../music/Storybook.mp3";
import StorybookJPG from "../../music/Storybook.jpg";

import { Song } from "./types";

const Songs: Song[] = [
  {
    id: 1,
    name: "Serenity",
    artist: "Riddiman",
    image: SerenityPNG,
    src: SerenityMP3,
  },
  {
    id: 2,
    name: "Tranquility",
    artist: "Riddiman",
    image: TranquilityPNG,
    src: TranquilityMP3,
  },
  {
    id: 3,
    name: "Biscuit",
    artist: "Lukrembo",
    image: BiscuitJPG,
    src: BiscuitMP3,
  },
  {
    id: 4,
    name: "Storybook",
    artist: "Lukrembo",
    image: StorybookJPG,
    src: StorybookMP3,
  },
  {
    id: 5,
    name: "Take Care",
    artist: "けｍ SURF",
    image: TakeCarePNG,
    src: TakeCareMP3,
  },
];

export default Songs;
