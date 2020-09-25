import { Page } from "framework7-react";
import React from "react";
import Colors from "../../colors";
import RoomLayout from "./components/RoomLayout";

const HomePage = () => {
  return (
    <Page style={{ backgroundColor: Colors.tertiaryLight }} noNavbar>
      <RoomLayout />
    </Page>
  );
};

export default HomePage;
