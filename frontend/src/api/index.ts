import { format, lastDayOfMonth, parse } from "date-fns";
import { JournalEntry } from "../pages/NewJournalPage/types";
import { Message } from "../pages/PaperCupsPage/Chat/types";
import LocalDatabase from "../utils/LocalDatabase";
import { cloudinaryUpload } from "./cloudinary";
import axiosInstance from "./config";
import { NotLoggedInError, OfflineError } from "./errors";

const isOnline = () => {
  return navigator.onLine;
};

/**
 * Base for all requests requiring authentication.
 * Paths:
 * 1. Online, token not expired => return token
 * 2. Online, token expired => reauthenticate and return token
 * 3. Online, token is invalid for some reason => clear tokens and throw error
 *
 * Assume token returned is always valid - i.e. do checking at IDB step
 */
export const getAuthToken = async (): Promise<string> => {
  const token = await LocalDatabase.getAuthToken();
  if (!token) {
    throw new NotLoggedInError();
  }

  if (token.isExpired) {
    const newToken = await reauthenticate(token.refreshToken);
    if (newToken) {
      await LocalDatabase.saveAuthToken(newToken, token.refreshToken);
      return newToken;
    } else {
      // can't refresh, just force login
      await LocalDatabase.clearAuthToken();
      throw new NotLoggedInError();
    }
  }

  return token.token;
};

export const reauthenticate = async (
  refreshToken: string
): Promise<string | null> => {
  try {
    const response = await axiosInstance.post("/auth/token", {
      refreshToken,
    });
    return response.data.accessToken.token;
  } catch (e) {
    await LocalDatabase.clearAuthToken();
    throw new NotLoggedInError();
  }
};

export const makeJournalPost = async (entry: JournalEntry) => {
  const dateString = format(entry.createdAt, "yyyy-MM-dd");
  if (isOnline()) {
    try {
      const token = await getAuthToken();
      const transformedRequest = {
        weather: entry.weather,
        location: entry.location,
        prompt: entry.block.prompt,
        content: entry.block.content,
        mood: entry.mood,
        date: dateString,
      };
      const res = await axiosInstance.post(
        `/journal/page?date=${dateString}`,
        transformedRequest,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.status === 200) {
        await LocalDatabase.cacheJournalPosts([
          {
            ...entry,
            id: dateString,
          },
        ]);
        return true;
      }
    } catch (e) {
      if (e instanceof NotLoggedInError) {
        throw e;
      }
      console.log(e);
    }
  } else {
    await LocalDatabase.queuePost({ ...entry, id: dateString });
    return true;
  }
};

const transformRawPost = (rawPost: { [x: string]: any }) => ({
  id: rawPost.date,
  createdAt: parse(rawPost.date, "yyyy-MM-dd", new Date()),
  mood: rawPost.mood,
  weather: rawPost.weather || undefined,
  location: rawPost.location || undefined,
  block: {
    prompt: rawPost.prompt,
    content: rawPost.content,
  },
});

export const getJournalPost = async (dateString: string) => {
  if (isOnline()) {
    try {
      const token = await getAuthToken();
      const result = await axiosInstance.get(
        `/journal/page/date?date=${dateString}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const post = transformRawPost(result.data);
      await LocalDatabase.cacheJournalPosts([post]);
    } catch (e) {
      // pass
    } finally {
      return LocalDatabase.getCachedJournalEntry(dateString);
    }
  }
};

// Using javascript months = 0: january 11: december
export const getJournalPosts = async (
  year: number,
  month: number
): Promise<JournalEntry[]> => {
  if (isOnline()) {
    try {
      const token = await getAuthToken();
      const firstDate = new Date(year, month, 1, 0, 0, 0);
      const lastDate = lastDayOfMonth(firstDate);
      const formattedFirstDate = format(firstDate, "yyyy-MM-dd");
      const formattedLastDate = format(lastDate, "yyyy-MM-dd");
      const result = await axiosInstance.get(
        `/journal/page/range?start=${formattedFirstDate}&end=${formattedLastDate}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const rawData = result.data;
      const transformed: JournalEntry[] = rawData.map(transformRawPost);
      await LocalDatabase.cacheJournalPosts(transformed);
    } catch (e) {
      // error, just return cached
    } finally {
      return LocalDatabase.getCachedJournalPosts();
    }
  } else {
    return LocalDatabase.getCachedJournalPosts();
  }
};

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string; // Bearer token
  refreshToken: string; // refresh token
  userId: string;
}

export const loginUser = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  if (isOnline()) {
    const response = await axiosInstance.post("/auth/login", request);
    if (response.status !== 200) {
      throw new Error();
    }
    return {
      token: response.data.accessToken.token,
      refreshToken: response.data.refreshToken,
      userId: response.data.id,
    };
  } else {
    throw new OfflineError();
  }
};

interface RegisterRequest {
  username: string;
  password: string;
}

interface RegisterResponse {
  token: string; // Bearer token
  refreshToken: string; // refresh token
  userId: string;
}

export const registerUser = async (
  request: RegisterRequest
): Promise<RegisterResponse> => {
  if (isOnline()) {
    const response = await axiosInstance.post("/auth/register", request);
    if (response.status !== 200) {
      throw new Error();
    }
    return {
      token: response.data.accessToken.token,
      refreshToken: response.data.refreshToken,
      userId: response.data.id,
    };
  } else {
    throw new OfflineError();
  }
};

interface FacebookLoginRequest {
  name: string; // FB name
  fbId: string; // FB ID
}

export const loginWithFacebook = async (
  request: FacebookLoginRequest
): Promise<LoginResponse> => {
  if (isOnline()) {
    const response = await axiosInstance.post("/auth/facebook", request);
    if (response.status !== 200) {
      throw new Error();
    }
    return {
      token: response.data.accessToken.token,
      refreshToken: response.data.refreshToken,
      userId: response.data.id,
    };
  } else {
    throw new OfflineError();
  }
};

export const loginAsGuest = async (): Promise<LoginResponse> => {
  if (isOnline()) {
    const response = await axiosInstance.post("/auth/guest");
    if (response.status !== 200) {
      throw new Error();
    }
    return {
      token: response.data.accessToken.token,
      refreshToken: response.data.refreshToken,
      userId: response.data.id,
    };
  } else {
    throw new OfflineError();
  }
};

type GetUnopenedSoundResponse = null | {
  url: string;
  userId: string;
  messageId: string;
};

export const getUnopenedSound = async (): Promise<GetUnopenedSoundResponse> => {
  if (isOnline()) {
    const token = await getAuthToken();
    const response = await axiosInstance.get("/message/randomUnopened", {
      headers: {
        Authorization: token,
      },
    });
    if (!response.data) {
      return null;
    }
    return {
      url: response.data.url,
      userId: response.data.user_id,
      messageId: response.data.id,
    };
  } else {
    throw new OfflineError();
  }
};

interface NewConversationRequest {
  userId: string; // user of other party
  messageId: string; // message of the thing
  blob: Blob; // blob of own voice
}

export const newConversationWith = async (request: NewConversationRequest) => {
  if (!isOnline()) {
    throw new OfflineError();
  }
  const token = await getAuthToken();
  const options = {
    headers: {
      Authorization: token,
    },
  };

  // step 1: new conversation
  const response = await axiosInstance.post(
    `/conversation`,
    {
      secondUserId: request.userId,
    },
    options
  );

  const convoId = response.data.id;

  // step 2: upload audio
  const url = await cloudinaryUpload(request.blob);

  // step 3: add message to convo
  await axiosInstance.post(
    `/message/withConversation`,
    {
      url,
      conversationId: convoId,
    },
    options
  );

  // step 4: mark first message as opened
  await axiosInstance.put(
    `/message/${request.messageId}`,
    {
      conversationId: convoId,
    },
    options
  );
};

interface SendMessageRequest {
  conversationId: string;
  blob: Blob;
}

export const sendMessage = async (req: SendMessageRequest) => {
  if (!isOnline()) {
    throw new OfflineError();
  }
  const token = await getAuthToken();
  const options = {
    headers: {
      Authorization: token,
    },
  };

  // step 1: upload audio
  const url = await cloudinaryUpload(req.blob);

  // step 2: add message to convo
  await axiosInstance.post(
    `/message/withConversation`,
    {
      url,
      conversationId: req.conversationId,
    },
    options
  );
};

/**
 * Get all convos in a nice format
 * also stores userid in indexeddb if not inside already
 * omg sideeffects!!!!
 */
export const getAllConvos = async () => {
  if (isOnline()) {
    const token = await getAuthToken();
    const options = {
      headers: {
        Authorization: token,
      },
    };
    const result = await axiosInstance.get(`/conversation/withUser`, options);

    let userId = await LocalDatabase.getUserId();
    if (!userId) {
      const res = await axiosInstance.get(`/user/profile`, options);
      userId = res.data.id;
      await LocalDatabase.setUserId(userId as string);
    }

    const conversations = [];
    for (const msg of result.data) {
      const {
        first_user_id,
        second_user_id,
        first_alias,
        second_alias,
        id,
      } = msg;
      const otherId = first_user_id === userId ? second_user_id : first_user_id;
      const otherAlias = first_user_id === userId ? second_alias : first_alias;
      conversations.push({
        id,
        otherPartyId: otherId,
        alias: otherAlias,
      });

      await LocalDatabase.storeConversation(id, {
        otherPartyId: otherId,
        otherPartyAlias: otherAlias,
      });
    }

    await LocalDatabase.deleteAllConvosNotIn(conversations.map((x) => x.id));
  }

  return LocalDatabase.getConversations();
};

export const blockUserAndDeleteConvo = async (
  userId: string,
  convoId: string
) => {
  if (isOnline()) {
    const token = await getAuthToken();
    const options = {
      headers: {
        Authorization: token,
      },
    };

    await axiosInstance.post(`/user/block?id=${userId}`, null, options);
    await axiosInstance.delete(`/conversation/${convoId}`, options);

    return true;
  } else {
    throw new OfflineError();
  }
};

export const getConvo = async (id: string) => {
  if (isOnline()) {
    const token = await getAuthToken();
    const options = {
      headers: {
        Authorization: token,
      },
    };

    const convoRes = await axiosInstance.get(`/conversation/${id}`, options);
    const result = await axiosInstance.get(
      `/message/withConversation/${id}`,
      options
    );

    let userId = await LocalDatabase.getUserId();
    if (!userId) {
      const res = await axiosInstance.get(`/user/profile`, options);
      userId = res.data.id;
      await LocalDatabase.setUserId(userId as string);
    }

    const otherPartyId =
      convoRes.data.first_user_id === userId
        ? convoRes.data.second_user_id
        : convoRes.data.first_user_id;
    const otherPartyAlias =
      convoRes.data.first_user_id === userId
        ? convoRes.data.second_alias
        : convoRes.data.first_alias;

    const transformed: Message[] = result.data.map((msg: any) => ({
      id: msg.id,
      userId: msg.user_id,
      url: msg.url,
      createdAt: msg.createdAt,
    }));
    await LocalDatabase.storeMessages(transformed);
    await LocalDatabase.storeConversation(id, {
      otherPartyAlias: otherPartyAlias,
      otherPartyId: otherPartyId,
      chat: transformed.map((x: any) => x.id),
    });
  }

  return LocalDatabase.getConversation(id);
};

export const getOwnProfile = async () => {
  if (isOnline()) {
    const token = await getAuthToken();
    const options = {
      headers: {
        Authorization: token,
      },
    };
    const res = await axiosInstance.get(`/user/profile`, options);
    const userId = res.data.id;
    await LocalDatabase.setUserId(userId as string);
  }

  return LocalDatabase.getUserId();
};

export const getOwnProfileOnline = async () => {
  if (isOnline()) {
    const token = await getAuthToken();
    const options = {
      headers: {
        Authorization: token,
      },
    };
    const res = await axiosInstance.get(`/user/profile`, options);
    const userId = res.data.id;
    await LocalDatabase.setUserId(userId as string);

    return {
      id: userId,
      username: res.data.username,
      fbId: res.data.fb_id,
    };
  }
};

export const changePassword = async (newPassword: string) => {
  if (isOnline()) {
    const token = await getAuthToken();
    const options = {
      headers: {
        Authorization: token,
      },
    };

    await axiosInstance.post(
      "/auth/change",
      {
        password: newPassword,
      },
      options
    );

    return true;
  } else {
    throw new OfflineError();
  }
};

export const changeEmail = async (username: string) => {
  if (isOnline()) {
    const token = await getAuthToken();
    const options = {
      headers: {
        Authorization: token,
      },
    };

    await axiosInstance.post(
      "/auth/change",
      {
        username,
      },
      options
    );

    return true;
  } else {
    throw new OfflineError();
  }
};

export const setGuestAccount = async (username: string, password: string) => {
  if (isOnline()) {
    const token = await getAuthToken();
    const options = {
      headers: {
        Authorization: token,
      },
    };

    await axiosInstance.post(
      "/auth/change",
      {
        username,
        password,
      },
      options
    );
  } else {
    throw new OfflineError();
  }
};

export const getUnopenedMessageCount = async (): Promise<number> => {
  if (isOnline()) {
    const token = await getAuthToken();
    const options = {
      headers: {
        Authorization: token,
      },
    };

    const response = await axiosInstance.get(`/message/validCount`, options);
    return response.data.count;
  } else {
    throw new OfflineError();
  }
};
