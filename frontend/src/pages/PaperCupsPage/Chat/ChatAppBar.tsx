import { Icon, Link, Navbar } from "framework7-react";
import React from "react";
import Colors from "../../../colors";
import Avatar from "../../../components/Avatar";
import { FlexRow } from "../../../components/layout";

interface Props {
  name: string;
  avatarUrl: string;
}

const ChatAppBar: React.FC<Props> = ({ name, avatarUrl }) => {
  return (
    <Navbar noShadow noHairline className="blue-text">
      <div
        className="navbar-bg"
        style={{ backgroundColor: Colors.secondary }}
      />
      <div className="left">
        <Link back>
          <Icon f7="chevron_left" />
        </Link>
        <FlexRow className="align-items-center ml-3">
          <Avatar url={avatarUrl} size={32} className="mr-3" />
          <div style={{ flexGrow: 1 }}>
            <p className="m-0">{name}</p>
          </div>
        </FlexRow>
      </div>
    </Navbar>
  );
};

export default ChatAppBar;
