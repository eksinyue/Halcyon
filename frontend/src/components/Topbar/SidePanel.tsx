import styled from "@emotion/styled";
import { Block, BlockTitle, Panel } from "framework7-react";
import React from "react";
import SidePanelItem from "./SidePanelItem";

const Container = styled.div`
  height: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const SidePanel = () => {
  return (
    <Panel left>
      <Container className="bg-color-primary">
        <Block>
          <BlockTitle>Andrea</BlockTitle>
          <p>Member since 2019</p>
        </Block>
      </Container>
      <Block>
        <SidePanelItem icon="house" title="Home" href="/" />
        <SidePanelItem icon="hammer" title="Preferences" />
        <SidePanelItem icon="suit_diamond_fill" title="Logout" />
      </Block>
    </Panel>
  );
};

export default SidePanel;
