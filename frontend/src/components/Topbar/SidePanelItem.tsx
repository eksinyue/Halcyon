import React from "react";
import { FlexRow } from "../layout";
import { Icon, Button } from "framework7-react";

interface Props {
  icon: string; // f7 icon name
  title: string;
  href?: string;
}

const SidePanelItem: React.FC<Props> = ({ icon, title, href }) => {
  return (
    <Button href={href} large color="black" panelClose>
      <FlexRow style={{ alignItems: "center" }}>
        <Icon f7={icon} className="mr-2" />
        <div>{title}</div>
      </FlexRow>
    </Button>
  );
};

export default SidePanelItem;
