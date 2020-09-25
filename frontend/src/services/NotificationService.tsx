import { f7 } from "framework7-react";
import IconPNG from "./icon.png";

interface Params {
  subtitle?: string;
  text: string;
  onClick?: () => void;
}

const iconString = `<img style="width: 16px; height: 16px;" src="${IconPNG}">`;

class NotificationService {
  notify = ({ subtitle, text, onClick }: Params) => {
    const notif = f7.notification.create({
      icon: iconString,
      title: "Halcyon",
      subtitle,
      text,
      closeOnClick: true,
      closeTimeout: 3000,
      on: {
        click: onClick,
      },
    });
    notif.open();
  };
}

export default new NotificationService();
