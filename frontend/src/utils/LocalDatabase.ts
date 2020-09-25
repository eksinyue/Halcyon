import { addHours, format, isBefore, parse } from "date-fns";
import { DBSchema, IDBPDatabase, openDB, deleteDB } from "idb";
import { JournalEntry } from "../pages/NewJournalPage/types";
import { Message } from "../pages/PaperCupsPage/Chat/types";

interface HalcyonDB extends DBSchema {
  onboarding: {
    key: string;
    value: boolean;
  };
  journalPages: {
    // journal pages that are cached
    key: string; // id
    value: JournalEntry;
  };
  queuedJournalPages: {
    // posts that are not sent to the server yet
    key: string; // uuid
    value: JournalEntry;
  };
  userPrefs: {
    // general user prefs
    key: string;
    value: string;
  };
  users: {
    // mapping from userID to some properties
    key: string;
    value: {
      id: string;
      alias: string;
    };
  };
  conversations: {
    key: string; // mapping from convo ID to some stuff
    value: {
      id: string;
      otherPartyId: string;
      otherPartyAlias: string;
      chat: string[];
    };
  };
  messages: {
    key: string; // mapping from message ID to user and url
    value: {
      id: string;
      userId: string;
      url: string;
    };
  };
}

export enum OnboardingTypes {
  App = "app",
  PaperCups = "papercups",
  Diary = "diary",
  Silent = "silent",
}

class LocalDatabase {
  name = "halcyon";
  db?: IDBPDatabase<HalcyonDB>;

  init = async () => {
    if (!this.db) {
      this.db = await openDB<HalcyonDB>(this.name, 1, {
        upgrade(db) {
          db.createObjectStore("onboarding");
          db.createObjectStore("journalPages");
          db.createObjectStore("queuedJournalPages");
          db.createObjectStore("userPrefs");
          db.createObjectStore("users");
          db.createObjectStore("conversations");
          db.createObjectStore("messages");
        },
      });
    }
  };

  isDBInitialized = () => !!this.db;

  setOnboarding = async (key: OnboardingTypes, value: boolean) => {
    await this.init();
    return this.db?.put("onboarding", value, key);
  };

  isOnboarded = async (key: OnboardingTypes) => {
    await this.init();
    const tx = this.db?.transaction("onboarding", "readonly");
    const store = tx?.objectStore("onboarding");
    const result = await store?.get(key);
    return result;
  };

  /**
   * Returns all journal posts that are cached + queued.
   * No order guaranteed.
   */
  getCachedJournalPosts = async (): Promise<JournalEntry[]> => {
    await this.init();
    if (!this.db) {
      return [];
    }
    const pages = await this.db.getAll("journalPages");
    const queuedPosts = await this.db.getAll("queuedJournalPages");
    return pages.concat(queuedPosts);
  };

  getCachedJournalEntry = async (id: string): Promise<JournalEntry | null> => {
    await this.init();
    if (!this.db) {
      return null;
    }
    const cachedEntry = await this.db.get("journalPages", id);
    if (cachedEntry) {
      return cachedEntry;
    }
    const queuedEntry = await this.db.get("queuedJournalPages", id);
    if (queuedEntry) {
      return queuedEntry;
    }
    return null;
  };

  cacheJournalPosts = async (posts: JournalEntry[]) => {
    await this.init();
    if (!this.db) {
      return;
    }

    for (const post of posts) {
      if (!post.id) {
        console.error("Post does not have ID! Abort abort!!!");
        continue;
      }
      await this.db.put("journalPages", post, post.id);
    }
  };

  queuePost = async (post: JournalEntry) => {
    await this.init();
    if (!this.db) {
      return;
    }
    return this.db.add("queuedJournalPages", post, post.id);
  };

  clearAllQueuedPosts = async () => {
    await this.init();
    if (!this.db) {
      return;
    }
    return this.db.clear("queuedJournalPages");
  };

  removeQueuedPost = async (id: string) => {
    await this.init();
    if (!this.db) {
      return;
    }
    return this.db.delete("queuedJournalPages", id);
  };

  clearAuthToken = async () => {
    await this.init();
    if (!this.db) {
      return;
    }
    await this.db.delete("userPrefs", "token");
    await this.db.delete("userPrefs", "tokenExpiry");
    await this.db.delete("userPrefs", "refreshToken");
  };

  saveAuthToken = async (token: string, refreshToken: string) => {
    await this.init();
    if (!this.db) {
      return;
    }
    await this.db.put("userPrefs", token, "token");
    await this.db.put("userPrefs", refreshToken, "refreshToken");
    await this.db.put(
      "userPrefs",
      format(addHours(new Date(), 12), "yyyy-MM-dd HH:mm:ss"),
      "tokenExpiry"
    );
  };

  getAuthToken = async (): Promise<{
    token: string;
    isExpired: boolean;
    refreshToken: string;
  } | null> => {
    await this.init();
    if (!this.db) {
      return null;
    }
    const token = await this.db.get("userPrefs", "token");
    const result = await this.db.get("userPrefs", "tokenExpiry");
    const refreshToken = await this.db.get("userPrefs", "refreshToken");
    if (!token || !result || !refreshToken) {
      return null;
    }
    const expiry = parse(result, "yyyy-MM-dd HH:mm:ss", new Date());
    if (isBefore(expiry, new Date())) {
      return {
        token,
        isExpired: true,
        refreshToken,
      };
    }
    return {
      token,
      isExpired: false,
      refreshToken,
    };
  };

  setMusicPlayerMute = async (b: boolean) => {
    await this.init();
    if (!this.db) {
      return null;
    }

    await this.db.put("userPrefs", `${b}`, "musicMute");
  };

  getMusicPlayerMute = async (): Promise<boolean> => {
    await this.init();
    if (!this.db) {
      return false;
    }

    const result = await this.db.get("userPrefs", "musicMute");
    if (!result) {
      return false;
    }
    return result === "true";
  };

  setSFX = async (b: boolean) => {
    await this.init();
    if (!this.db) {
      return null;
    }

    await this.db.put("userPrefs", `${b}`, "sfx");
  };

  getSFX = async () => {
    await this.init();
    if (!this.db) {
      return null;
    }

    const res = await this.db.get("userPrefs", "sfx");
    if (!res) {
      return false;
    }
    return res === "true";
  };

  setUserId = async (id: string) => {
    await this.init();
    if (!this.db) {
      return null;
    }
    await this.db.put("userPrefs", id, "userId");
  };

  getUserId = async () => {
    await this.init();
    if (!this.db) {
      return null;
    }
    return this.db.get("userPrefs", "userId");
  };

  clearUserId = async () => {
    await this.init();
    if (!this.db) {
      return null;
    }

    return this.db.delete("userPrefs", "userId");
  };

  storeUser = async (id: string, alias: string) => {
    await this.init();
    if (!this.db) {
      return null;
    }

    return this.db.put(
      "users",
      {
        id,
        alias,
      },
      id
    );
  };

  getUser = async (id: string) => {
    await this.init();
    if (!this.db) {
      return null;
    }

    console.log(id);
    return this.db.get("users", id);
  };

  storeConversation = async (
    id: string,
    value: { otherPartyId?: string; otherPartyAlias?: string; chat?: string[] }
  ) => {
    await this.init();
    if (!this.db) {
      return null;
    }
    const prevValue = await this.db.get("conversations", id);
    let realChats: string[];
    let realOtherPartyAlias: string;
    let realOtherPartyId: string;

    if (!value.chat) {
      // don't update chats
      if (prevValue) {
        realChats = prevValue.chat;
      } else {
        realChats = [];
      }
    } else {
      realChats = value.chat;
    }

    if (!value.otherPartyAlias) {
      if (prevValue) {
        realOtherPartyAlias = prevValue.otherPartyAlias;
      } else {
        realOtherPartyAlias = "";
      }
    } else {
      realOtherPartyAlias = value.otherPartyAlias;
    }

    if (!value.otherPartyId) {
      if (prevValue) {
        realOtherPartyId = prevValue.otherPartyId;
      } else {
        realOtherPartyId = "";
      }
    } else {
      realOtherPartyId = value.otherPartyId;
    }

    return this.db.put(
      "conversations",
      {
        otherPartyId: realOtherPartyId,
        otherPartyAlias: realOtherPartyAlias,
        chat: realChats,
        id,
      },
      id
    );
  };

  deleteAllConvosNotIn = async (convoIds: string[]) => {
    await this.init();
    if (!this.db) {
      return null;
    }
    const convos = await this.db.getAll("conversations");
    const convosToDelete = convos.filter(
      (convo) => convoIds.indexOf(convo.id) === -1
    );

    const db = this.db;
    return Promise.all(
      convosToDelete.map((con) => db.delete("conversations", con.id))
    );
  };

  getConversation = async (id: string) => {
    await this.init();
    if (!this.db) {
      return null;
    }

    const convo = await this.db.get("conversations", id);
    if (!convo) {
      return null;
    }
    const messages = await this.db.getAll("messages");
    const mappedMessages: Record<string, Message> = messages.reduce(
      (obj, x) => ({
        ...obj,
        [x.id]: x,
      }),
      {}
    );

    return {
      ...convo,
      messages: convo.chat.map((id) => mappedMessages[id]),
    };
  };

  getConversations = async () => {
    await this.init();
    if (!this.db) {
      return null;
    }

    const convos = await this.db.getAll("conversations");
    const messages = await this.db.getAll("messages");
    const mappedMessages: Record<string, Message> = messages.reduce(
      (obj, x) => ({
        ...obj,
        [x.id]: x,
      }),
      {}
    );
    return convos.map((convo) => ({
      ...convo,
      messages: convo.chat.map((id) =>
        mappedMessages[id]
          ? mappedMessages[id]
          : {
              id,
            }
      ),
    }));
  };

  storeMessages = async (messages: Message[]) => {
    await this.init();
    if (!this.db) {
      return null;
    }

    const db = this.db;

    return Promise.all(messages.map((msg) => db.put("messages", msg, msg.id)));
  };

  /**
   * In the EXTREMELY RARE case that the user downloads the app,
   * goes offline BEFORE signing in, we queue the guest account creation as well.
   */
  queueGuestAccount = async (created: boolean = false) => {
    await this.init();
    if (!this.db) {
      return null;
    }

    return this.db.put("userPrefs", created ? "false" : "true", "guestQueue");
  };

  /**
   * See above.
   */
  isGuestAccountQueued = async () => {
    await this.init();
    if (!this.db) {
      return null;
    }

    const result = await this.db.get("userPrefs", "guestQueue");
    return result === "true";
  };

  clear = async () => {
    await this.init();
    if (!this.db) {
      return null;
    }

    const tx = await this.db.transaction(
      [
        "onboarding",
        "journalPages",
        "queuedJournalPages",
        "userPrefs",
        "users",
        "conversations",
        "messages",
      ],
      "readwrite"
    );

    const onboarding = tx.objectStore("onboarding");
    const journalPages = tx.objectStore("journalPages");
    const queuedJournalPages = tx.objectStore("queuedJournalPages");
    const userPrefs = tx.objectStore("userPrefs");
    const users = tx.objectStore("users");
    const conversations = tx.objectStore("conversations");
    const messages = tx.objectStore("messages");

    return Promise.all([
      onboarding.clear(),
      journalPages.clear(),
      queuedJournalPages.clear(),
      userPrefs.clear(),
      users.clear(),
      conversations.clear(),
      messages.clear(),
    ]);
  };
}

export default new LocalDatabase();
