import {
  f7,
  List,
  ListButton,
  Page,
  PageContent,
  Popover,
} from "framework7-react";
import React, { useEffect, useRef, useState } from "react";
import {
  blockUserAndDeleteConvo,
  getConvo,
  getOwnProfile,
  sendMessage,
} from "../../../api";
import { OfflineError } from "../../../api/errors";
import Colors from "../../../colors";
import ToastService from "../../../services/ToastService";
import LocalDatabase from "../../../utils/LocalDatabase";
import Recorder from "../Speak/Recorder";
import useInterval from "../Speak/useInterval";
import ChatAppBar from "./ChatAppBar";
import ChatBox from "./ChatBox";
import ChatHistory from "./ChatHistory";
import { Conversation } from "./types";
import { capitalCase } from "change-case";

interface Props {
  id: string;
}

const Chat: React.FC<Props> = ({ id }) => {
  const [recorder, setRecorder] = useState(new Recorder());
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [conversation, setConversation] = useState<Conversation>();
  const [otherParty, setOtherParty] = useState<{ id: string; alias: string }>();
  const [userId, setUserId] = useState<string>(); // own id
  const containerRef = useRef<any>(null);

  const refresh = async () => {
    const cachedConvo = await LocalDatabase.getConversation(id);
    if (cachedConvo) {
      setConversation(cachedConvo);
      setOtherParty({
        id: cachedConvo.otherPartyId,
        alias: cachedConvo.otherPartyAlias,
      });
    }
    const conversation = await getConvo(id);
    if (!conversation) {
      return;
    }
    setConversation(conversation);
    setOtherParty({
      id: conversation.otherPartyId,
      alias: conversation.otherPartyAlias,
    });
  };

  const blockAndDelete = async () => {
    if (!conversation) {
      return;
    }
    const yes = window.confirm(
      `Are you sure you want to block this user? This person will not be able to contact you anymore.`
    );
    if (!yes) {
      return;
    }
    try {
      await blockUserAndDeleteConvo(conversation.otherPartyId, conversation.id);
      f7.views.main.router.navigate("/papercups/conversations");
      f7.popover.close(".popover-menu");
    } catch (e) {
      if (e instanceof OfflineError) {
        ToastService.toastBottom("You have to be online to block a user.");
      } else {
        ToastService.toastBottom("Something went wrong. Try again.");
      }
    }
  };

  useEffect(() => {
    refresh();
  }, [id]);

  useInterval(refresh, 10000);

  useEffect(() => {
    LocalDatabase.getUserId().then((id) => {
      if (id) {
        setUserId(id);
      } else {
        getOwnProfile().then((id) => {
          if (id) {
            setUserId(id);
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.on("play", () => {
        setIsPlaying(true);
      });
      wavesurfer.on("pause", () => {
        setIsPlaying(false);
      });
      wavesurfer.on("finish", () => {
        setIsPlaying(false);
        wavesurfer.seekTo(0);
      });
    }
  }, [wavesurfer]);

  const startRecord = async () => {
    await recorder.init();
    recorder.addOnDataAvailable(() => {
      setBlob(new Blob(recorder.blobs));
    });

    await recorder.start(1000);
    setIsStarted(true);
  };

  const stopRecord = () => {
    if (!recorder) {
      return;
    }
    setIsStarted(false);
    recorder.stop();
  };

  const sendVoiceMsg = async () => {
    if (!conversation || !blob) {
      return;
    }
    setIsSending(true);
    try {
      await sendMessage({ conversationId: conversation.id, blob: blob });
      setBlob(null);
      recorder.reset();
      await refresh();
    } catch (e) {
      if (e instanceof OfflineError) {
        ToastService.toastBottom(
          `You can't send messages while offline. Go online to send this message!`
        );
      } else {
        ToastService.toastBottom("Something wrong happened. Try again.");
      }
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const innerElement = containerRef.current.eventTargetEl;
      const offsetTop = innerElement.scrollHeight;
      setTimeout(() => {
        innerElement.scrollTop = offsetTop;
      }, 400);
    }
  }, [containerRef]);

  return (
    <Page
      style={{ backgroundColor: Colors.secondaryLight }}
      pageContent={false}
    >
      <ChatAppBar
        name={capitalCase(otherParty?.alias || "Anonymous")}
        avatarUrl={`https://api.adorable.io/avatars/285/${
          otherParty?.alias || "Anonymous"
        }.png`}
      />
      <ChatBox
        onMicPress={startRecord}
        isRecording={isStarted}
        isPlaying={isPlaying}
        hasRecording={!!blob}
        blob={blob}
        wavesurfer={wavesurfer}
        onSend={sendVoiceMsg}
        setWavesurfer={setWavesurfer}
        onPlay={() => wavesurfer?.play()}
        onPause={() => wavesurfer?.pause()}
        onReset={() => {
          setBlob(null);
          recorder.reset();
        }}
        isSending={isSending}
        onStopRecording={stopRecord}
      />
      <PageContent ref={containerRef}>
        <ChatHistory conversation={conversation} userId={userId} />
      </PageContent>
      <Popover className="popover-menu">
        <List>
          <ListButton onClick={blockAndDelete}>
            Block user and delete conversation
          </ListButton>
        </List>
      </Popover>
    </Page>
  );
};

export default Chat;
