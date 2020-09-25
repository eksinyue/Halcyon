import { Button, Navbar } from "framework7-react";
import React from "react";

const Topbar = () => {
  return (
    <Navbar>
      <div className="left">
        <Button
          small
          panelToggle="left"
          className="display-flex"
          iconF7="bars"
        />
      </div>
    </Navbar>
  );
};

export default Topbar;
