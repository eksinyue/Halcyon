import { Button, Icon, Navbar } from "framework7-react";
import React from "react";

interface Props {
  back?: string; // back href instead of simple back
}

const SimpleTopBar: React.FC<Props> = ({ back }) => {
  return (
    <Navbar noHairline noShadow transparent className="blue-text">
      <Button back={back ? false : true} href={back}>
        <Icon f7="chevron_left" />
      </Button>
    </Navbar>
  );
};

export default SimpleTopBar;
