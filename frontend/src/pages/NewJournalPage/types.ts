export enum Mood {
  Happy = "happy",
  Relaxed = "relaxed",
  Sad = "sad",
  Tired = "tired",
  Stressed = "stressed",
  Angry = "angry",
}

export type JournalEntry = {
  id?: string;
  tempId?: string; // used to page to queued diary entries
  createdAt: Date;
  mood: Mood;
  weather?: string;
  location?: string;
  temperature?: number;
  block: JournalBlock;
};

export type JournalBlock = {
  prompt: string;
  content: string;
};
