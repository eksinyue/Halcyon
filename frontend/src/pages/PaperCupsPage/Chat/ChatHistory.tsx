import { Icon } from "framework7-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Colors from "../../../colors";
import AudioVisualizerURL from "../../../components/AudioVisualizerURL";
import Avatar from "../../../components/Avatar";
import { FlexRow } from "../../../components/layout";
import SaneBlock from "../../../components/SaneBlock";
import { ReadableMessage, toReadableChat } from "./ChatTypes";
import { Conversation } from "./types";

interface Props {
  conversation?: Conversation;
  userId?: string;
}

const ChatHistory: React.FC<Props> = ({ conversation, userId }) => {
  const formattedMessages: ReadableMessage[] = useMemo(() => {
    if (!conversation || !userId) {
      return [];
    }
    return conversation.messages.map((msg) =>
      toReadableChat(msg, userId, conversation.otherPartyAlias)
    );
  }, [conversation, userId]);
  const containerRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      const offsetTop = containerRef.current.offsetTop || 0;
      containerRef.current.scrollTop = offsetTop;
    }
  }, [containerRef]);
  return (
    <SaneBlock
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        position: "relative",
      }}
      ref={containerRef}
    >
      {formattedMessages.map((msg) => (
        <MessageBox key={msg.id} message={msg} />
      ))}
    </SaneBlock>
  );
};

const MessageBox: React.FC<{ message: ReadableMessage }> = ({ message }) => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const onPlayPause = () => {
    wavesurfer?.playPause();
  };
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
  return (
    <FlexRow
      style={{
        alignSelf: message.type === "sent" ? "flex-end" : "flex-start",
      }}
      className="m-2"
    >
      {message.type === "received" ? (
        <div
          style={{
            alignSelf: "flex-end",
          }}
          className="mr-2"
        >
          <Avatar size={32} url={message.avatar} />
        </div>
      ) : null}
      <div
        style={{
          borderRadius: "8px",
          maxWidth: "100%",
          width: "200px",
          display: "flex",
          alignItems: "center",
          backgroundColor:
            message.type === "sent" ? Colors.secondary : Colors.primary,
        }}
        className="blue-text pl-3 pr-3 pt-2 pb-2 pointer"
        onClick={onPlayPause}
      >
        {isPlaying ? (
          <Icon
            f7="pause_fill"
            style={{
              color:
                message.type === "sent"
                  ? Colors.secondaryDark
                  : Colors.primaryDark,
              display: "block",
              marginRight: "8px",
            }}
          />
        ) : (
          <Icon
            f7="play_fill"
            style={{
              color:
                message.type === "sent"
                  ? Colors.secondaryDark
                  : Colors.primaryDark,
              display: "block",
              marginRight: "8px",
            }}
          />
        )}
        <AudioVisualizerURL
          url={message.voiceMessage}
          height={64}
          color={
            message.type === "sent"
              ? Colors.secondaryLight
              : Colors.primaryLight
          }
          progressColor={
            message.type === "sent" ? Colors.secondaryDark : Colors.primaryDark
          }
          wavesurfer={wavesurfer}
          setWavesurfer={setWavesurfer}
        />
      </div>
    </FlexRow>
  );
};

export default ChatHistory;
