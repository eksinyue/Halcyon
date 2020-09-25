import Axios from "axios";
import { getAuthToken } from ".";
import axiosInstance from "./config";
import { OfflineError } from "./errors";

const CLOUDINARY_USERNAME = "caephler";
const CLOUDINARY_PRESET = "uionmp2n";

export const cloudinaryUpload = async (blob: Blob): Promise<any> => {
  if (!navigator.onLine) {
    // not online, just throw error
    throw new OfflineError();
  }

  const username = CLOUDINARY_USERNAME;
  const preset = CLOUDINARY_PRESET;
  const formData = new FormData();
  formData.append("file", blob);
  formData.append("upload_preset", preset);

  try {
    const result = await Axios.post(
      `https://api.cloudinary.com/v1_1/${username}/auto/upload`,
      formData
    );
    if (result.status !== 200) {
      throw new Error();
    }

    const url = result.data.secure_url;

    return url;
  } catch (e) {
    throw e;
  }
};

export const uploadAudio = async (blob: Blob): Promise<any> => {
  if (!navigator.onLine) {
    // not online, just throw error
    throw new OfflineError();
  }

  const token = await getAuthToken();

  try {
    const url = await cloudinaryUpload(blob);
    const messageResult = await axiosInstance.post(
      "/message",
      {
        url,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (messageResult.status !== 200) {
      throw new Error();
    }

    return messageResult;
  } catch (e) {
    throw new Error();
  }
};
