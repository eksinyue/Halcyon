import { Howl, Howler } from "howler";
import { v4 as uuidv4 } from "uuid";
import LocalDatabase from "../utils/LocalDatabase";

Howler.autoUnlock = false;
class SFXPlayer {
  howl?: Howl;
  isMuted: boolean = false;
  onMuteCbs: Record<string, (b: boolean) => void> = {};

  constructor() {
    LocalDatabase.getSFX().then((isMuted) => {
      if (isMuted) {
        this.mute();
      } else {
        this.unmute();
      }
    });

    this.onMuteCbs[uuidv4()] = (b) => {
      LocalDatabase.setSFX(b);
    };
  }

  get isPlaying(): boolean {
    if (!this.howl) {
      return false;
    }
    return this.howl.playing();
  }

  play = (sfx: string) => {
    if (this.howl) {
      this.howl.stop();
    }

    this.howl = new Howl({
      loop: false,
      src: [sfx],
      mute: this.isMuted,
      volume: 0.5,
    });
    this.howl.play();
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

  onMute = (fn: (b: boolean) => void) => {
    const id = uuidv4();
    this.onMuteCbs[id] = fn;
    return id;
  };

  removeOnMute = (id: string) => {
    delete this.onMuteCbs[id];
  };
}

export default new SFXPlayer();
