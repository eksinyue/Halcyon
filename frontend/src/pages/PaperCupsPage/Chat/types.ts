export interface Conversation {
  id: string;
  otherPartyId: string;
  otherPartyAlias: string;
  messages: Message[];
}

export interface Message {
  id: string;
  createdAt: Date;
  userId: string;
  url: string;
}
