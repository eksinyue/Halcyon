import { Block, BlockTitle, Page, PageContent } from "framework7-react";
import React, { useEffect, useState } from "react";
import Colors from "../../colors";
import SaneBlock from "../../components/SaneBlock";
import SimpleTopBar from "../../components/SimpleTopBar";
import MusicPlayer from "../../music/MusicPlayer";
import ToastService from "../../services/ToastService";
import SongCard from "./SongCard";
import Songs from "./songs";
import VinylPlayer from "./VinylPlayer/index";

const VinylPage = () => {
  const [isPlaying, setIsPlaying] = useState(MusicPlayer.isPlaying);
  const [currentSong, setCurrentSong] = useState(MusicPlayer.song);

  useEffect(() => {
    const id = MusicPlayer.onStateChange((state) => {
      setIsPlaying(state === "play");
    });

    return () => {
      MusicPlayer.removeOnStateChange(id);
    };
  }, []);

  useEffect(() => {
    const id = MusicPlayer.onSongChange((nextSong) => {
      setCurrentSong(nextSong);
    });

    return () => {
      MusicPlayer.removeOnSongChange(id);
    };
  });

  useEffect(() => {
    // check if muted
    if (MusicPlayer.isMuted) {
      ToastService.toastBottom(
        `You have disabled music, so no music will play. Go to your profile page to set it.`
      );
    }
  }, []);

  return (
    <Page
      pageContent={false}
      style={{ backgroundColor: Colors.primaryLighter }}
    >
      <SimpleTopBar back="/" />
      <PageContent className="blue-text">
        <SaneBlock>
          <VinylPlayer song={currentSong} isPlaying={isPlaying} />
          <div className="mt-3 mb-3">
            <small>Now playing:</small>
            <h1 className="m-0">
              {currentSong ? currentSong.name : "Nothing"}
            </h1>
            <h2 className="m-0" style={{ height: "1em" }}>
              {currentSong ? currentSong.artist : " "}
            </h2>
          </div>
          <BlockTitle className="mt-0 ml-0 mr-0 blue-text">
            Other music
          </BlockTitle>
          {Songs.map((song) => (
            <SongCard
              song={song}
              onSelect={() => MusicPlayer.play(song)}
              key={song.id}
              isPlaying={song.id === currentSong?.id}
            />
          ))}
        </SaneBlock>
      </PageContent>
    </Page>
  );
};

export default VinylPage;
