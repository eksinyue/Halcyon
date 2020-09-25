import React from "react";
import { animated, useSpring } from "react-spring";
import Colors from "../../../../../colors";

interface Props {
  icon: string;
  text: string;
  active: boolean;
  onClick: () => void;
}

const MoodButton: React.FC<Props> = ({ icon, text, active, onClick }) => {
  const style = useSpring({
    color: Colors.primaryDark,
    opacity: active ? "1.0" : "0.6",
    fontWeight: active ? "bold" : "normal",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transform: active ? "scale(1.2)" : "scale(1)",
  });

  return (
    <animated.div
      className="ml-4 mr-4 mb-2 mt-2 pointer"
      onClick={onClick}
      style={style}
    >
      <img src={icon} style={{ width: "64px", height: "64px" }} alt={text} />
      <p className="m-0">{text}</p>
    </animated.div>
  );
};

export default MoodButton;
