import { Howl, Howler } from "howler";
import React from "react";
import { Song } from "../pages/VinylPage/types";
import { v4 as uuidv4 } from "uuid";
import LocalDatabase from "../utils/LocalDatabase";

Howler.autoUnlock = false;
export class MusicPlayer {
  howl?: Howl;
  song?: Song;
  isMuted: boolean = false;
  stateChangeCbs: Record<
    string,
    (state: "play" | "paused" | "stopped") => void
  > = {};
  songChangeCbs: Record<string, (nextSong: Song, prevSong?: Song) => void> = {};
  onMuteCbs: Record<string, (b: boolean) => void> = {};

  constructor() {
    LocalDatabase.getMusicPlayerMute().then((isMuted) => {
      if (isMuted) {
        this.mute();
      } else {
        this.unmute();
      }
    });

    this.onMuteCbs[uuidv4()] = (b) => {
      LocalDatabase.setMusicPlayerMute(b);
    };
  }

  get isPlaying(): boolean {
    if (!this.howl) {
      return false;
    }
    return this.howl.playing();
  }

  play = (song: Song) => {
    if (this.howl) {
      this.howl.stop();
    }

    const prevSong = this.song;
    this.song = song;
    this.howl = new Howl({
      loop: true,
      src: [song.src],
      mute: this.isMuted,
      volume: 0.6,
    });
    this.howl.on("play", () => {
      Object.values(this.stateChangeCbs).forEach((fn) => fn("play"));
    });
    this.howl.on("pause", () => {
      Object.values(this.stateChangeCbs).forEach((fn) => fn("paused"));
    });
    this.howl.on("stop", () => {
      Object.values(this.stateChangeCbs).forEach((fn) => fn("stopped"));
    });
    Object.values(this.songChangeCbs).forEach((fn) => fn(song, prevSong));
    this.howl.play();
  };

  pause = () => {
    this.howl?.pause();
  };

  resume = () => {
    this.howl?.play();
  };

  stop = () => {
    this.howl?.stop();
    this.song = undefined;
  };

  mute = () => {
    this.isMuted = true;
    this.howl?.mute(this.isMuted);
    Object.values(this.onMuteCbs).forEach((fn) => fn(this.isMuted));
  };

  unmute = () => {
    this.isMuted = false;
    this.howl?.mute(this.isMuted);
    Object.values(this.onMuteCbs).forEach((fn) => fn(this.isMuted));
  };

  toggleMute = () => {
    this.isMuted = !this.isMuted;
    this.howl?.mute(this.isMuted);
    Object.values(this.onMuteCbs).forEach((fn) => fn(this.isMuted));
  };

  onStateChange = (fn: (state: "play" | "paused" | "stopped") => void) => {
    const id = uuidv4();
    this.stateChangeCbs[id] = fn;
    return id;
  };

  removeOnStateChange = (id: string) => {
    delete this.stateChangeCbs[id];
  };

  onSongChange = (fn: (nextSong: Song, previousSong?: Song) => void) => {
    const id = uuidv4();
    this.songChangeCbs[id] = fn;
    return id;
  };

  removeOnSongChange = (id: string) => {
    delete this.songChangeCbs[id];
  };

  onMute = (fn: (b: boolean) => void) => {
    const id = uuidv4();
    this.onMuteCbs[id] = fn;
    return id;
  };

  removeOnMute = (id: string) => {
    delete this.onMuteCbs[id];
  };
}

export const MusicContext = React.createContext(MusicPlayer);
export default new MusicPlayer();
