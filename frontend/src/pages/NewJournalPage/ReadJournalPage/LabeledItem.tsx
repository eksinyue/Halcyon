import React from "react";
import { FlexRow } from "../../../components/layout";
import { Icon } from "framework7-react";

interface Props {
  icon: string; // f7 icon
  text: string;
}

const LabeledItem: React.FC<Props> = ({ icon, text }) => {
  return (
    <FlexRow style={{ alignItems: "center" }}>
      <Icon f7={icon} className="mr-2" />
      <p>{text}</p>
    </FlexRow>
  );
};
export default LabeledItem;
