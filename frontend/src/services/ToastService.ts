import { f7 } from "framework7-react";

class ToastService {
  toastBottom = (text?: string, duration: number = 3000) => {
    const toast = f7.toast.create({
      text,
      closeTimeout: duration,
      position: "bottom",
    });
    toast.open();
  };
}

export default new ToastService();
