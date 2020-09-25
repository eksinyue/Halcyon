import styled from "@emotion/styled";
import { Block, Icon, Page, PageContent } from "framework7-react";
import React, { useState } from "react";
import { animated, useSpring, useTransition } from "react-spring";
import { uploadAudio } from "../../../api/cloudinary";
import { OfflineError } from "../../../api/errors";
import Colors from "../../../colors";
import { MutedButton, PinkButton } from "../../../components/CustomButton";
import SaneBlock from "../../../components/SaneBlock";
import SimpleTopBar from "../../../components/SimpleTopBar";
import PromptService from "../../../services/PromptService";
import ToastService from "../../../services/ToastService";
import MicrophoneCard from "./MicrophoneCard";
import Recorder from "./Recorder";
import SpeakingBirdPNG from "./SpeakingBirb.png";

const SpeakPage = () => {
  const [loading, setLoading] = useState(false);
  const [recorder, setRecorder] = useState<Recorder>(new Recorder());
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [prompt, setPrompt] = useState(PromptService.newOtherPrompt());
  const [isEnd, setIsEnd] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);

  const doneContainerStyle = useSpring({
    opacity: blob ? 1 : 0,
    maxWidth: "200px",
    margin: "16px auto",
  });

  const upload = async () => {
    if (!blob) {
      return;
    }
    setLoading(true);
    try {
      await uploadAudio(blob);
      // OK - send to next page
      setIsEnd(true);
    } catch (e) {
      if (e instanceof OfflineError) {
        ToastService.toastBottom(
          `You can't upload while offline. Go online to access this feature.`
        );
      } else {
        ToastService.toastBottom("Something wrong happened. Try again. :(");
      }
    } finally {
      setLoading(false);
    }
  };

  const transitions = useTransition(isEnd, (r) => (r ? "ok" : "no"), {
    from: {
      opacity: 0,
      transform: "translate3d(100%, 0, 0)",
      position: "absolute",
    },
    enter: {
      opacity: 1,
      transform: "translate3d(0%, 0, 0)",
      position: "relative",
    },
    leave: {
      opacity: 0,
      transform: "translate3d(-50%, 0, 0)",
      position: "absolute",
    },
  });

  const renderContent = () => {
    return transitions.map(({ item: isEnd, key, props }) => {
      if (isEnd) {
        return (
          <animated.div style={props} key={key}>
            <Block style={{ maxWidth: "400px", margin: "0 auto " }}>
              <p className="text-align-center">
                Your message is out in the wild!
              </p>
              <PinkButton href="/papercups/conversations">
                To Conversations
              </PinkButton>
            </Block>
          </animated.div>
        );
      } else {
        return (
          <animated.div style={props} key={key}>
            <SaneBlock>
              <p
                className="text-align-center text-2 m-0"
                style={{ minHeight: "60px" }}
              >
                <strong>{prompt}</strong>
              </p>
              <MutedButton
                onClick={() => setPrompt(PromptService.newOtherPrompt())}
              >
                <Icon f7="shuffle" className="mr-2" />
                New Prompt
              </MutedButton>
              <div className="mt-4 mb-4" />
              <MicrophoneCard
                recorder={recorder}
                setRecorder={setRecorder}
                isRecording={isRecording}
                setIsRecording={setIsRecording}
                blob={blob}
                setBlob={setBlob}
                wavesurfer={wavesurfer}
                setWavesurfer={setWavesurfer}
              />
            </SaneBlock>
            {blob && !isRecording ? (
              <animated.div style={doneContainerStyle}>
                <PinkButton onClick={upload} loading={loading}>
                  I'm done!
                </PinkButton>
                <MutedButton
                  onClick={() => {
                    recorder.reset();
                    setBlob(null);
                    setWavesurfer(null);
                  }}
                >
                  Reset
                </MutedButton>
              </animated.div>
            ) : null}
          </animated.div>
        );
      }
    });
  };

  return (
    <Page
      style={{ backgroundColor: Colors.secondaryLight }}
      className="blue-text"
      pageContent={false}
    >
      <SimpleTopBar back="/papercups" />
      <PageContent>
        <SpeakingBirb>
          <h1>Let me speak!</h1>
        </SpeakingBirb>
        {renderContent()}
      </PageContent>
    </Page>
  );
};

const SpeakingBirb = styled.div`
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  background: url(${SpeakingBirdPNG}) no-repeat;
  background-size: contain;
  background-position: center;
`;

export default SpeakPage;
