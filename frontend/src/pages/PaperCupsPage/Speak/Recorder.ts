import AudioRecorder from "audio-recorder-polyfill";

// @ts-ignore
import mpegEncoder from "audio-recorder-polyfill/mpeg-encoder";

AudioRecorder.encoder = mpegEncoder;
AudioRecorder.prototype.mimeType = "audio/mpeg";

window.MediaRecorder = AudioRecorder;

class Recorder {
  private _recorder?: MediaRecorder;
  blobs: Blob[] = [];
  onDataAvailCb: ((blob: Blob) => void)[] = [];
  isRecording: boolean = false;

  init = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      this.onDataAvailCb = [];
      this._recorder = new MediaRecorder(stream, {
        audioBitsPerSecond: 64000,
        mimeType: "audio/mpeg",
      });
      this._recorder.addEventListener("start", () => {
        this.isRecording = true;
      });
      this._recorder.addEventListener("dataavailable", (e: BlobEvent) => {
        this.onDataAvailable(e);
      });
      this._recorder.addEventListener("stop", () => {
        this.isRecording = false;
      });
    } catch (e) {
      console.log(e);
      console.error("something wrong happened");
    }
  };

  start = (timeslice: number = 1000) => {
    if (this.isRecording) {
      return;
    }
    this._recorder?.start();
  };

  stop = async () => {
    if (!this.isRecording) {
      return;
    }
    this.isRecording = false;
    this._recorder!.stop();
    // this is not the final blob!!!! need to wait for onDataAvailable

    this._recorder!.stream.getTracks().forEach((track) => track.stop());
    return new Blob(this.blobs);
  };

  onDataAvailable = (e: BlobEvent) => {
    this.blobs.push(e.data);
    this.onDataAvailCb.forEach((fn) => fn(e.data));
  };

  addOnDataAvailable = (fn: (blob: Blob) => void) => {
    this.onDataAvailCb.push(fn);
  };

  reset = () => {
    this.onDataAvailCb = [];
    this.blobs = [];
  };
}

export default Recorder;
