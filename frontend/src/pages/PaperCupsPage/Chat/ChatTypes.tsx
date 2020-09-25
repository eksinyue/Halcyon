import { snakeCase } from "change-case";
import { Message } from "./types";

export enum Sender {
  Self,
  Other,
}

export type ReadableMessage = {
  id: string;
  type: "sent" | "received";
  avatar: string;
  voiceMessage: string;
  sentAt: Date;
  userId: string;
};

export const toReadableChat = (
  chat: Message,
  userId: string,
  otherPartyAlias: string
): ReadableMessage => {
  if (chat.userId === userId) {
    return {
      id: chat.id,
      type: "sent",
      voiceMessage: chat.url,
      avatar: `https://api.adorable.io/avatars/285/Anonymous.png`,
      sentAt: chat.createdAt,
      userId: chat.userId,
    };
  }

  return {
    id: chat.id,
    type: "received",
    voiceMessage: chat.url,
    avatar: `https://api.adorable.io/avatars/285/${snakeCase(
      otherPartyAlias
    )}.png`,
    sentAt: chat.createdAt,
    userId: chat.userId,
  };
};
