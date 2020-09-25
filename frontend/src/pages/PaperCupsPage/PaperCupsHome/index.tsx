import styled from "@emotion/styled";
import { Page, PageContent } from "framework7-react";
import React from "react";
import Colors from "../../../colors";
import { PinkButton } from "../../../components/CustomButton";
import SaneBlock from "../../../components/SaneBlock";
import SimpleTopBar from "../../../components/SimpleTopBar";
import BirdPairPNG from "./BirdPair.png";
import PaperCupsPNG from "./PaperCups.png";

const PaperCupsHome = () => {
  return (
    <Page
      pageContent={false}
      style={{ backgroundColor: Colors.secondaryLight }}
      className="blue-text"
    >
      <SimpleTopBar back="/" />
      <PageContent>
        <SaneBlock>
          <PaperCupsImage />
          <h1 className="text-align-center">Paper Cups</h1>
          <BirdPairContainer>
            <TopButtonContainer>
              <PinkButton style={{ width: "120px" }} href="/papercups/speak">
                Let me speak!
              </PinkButton>
            </TopButtonContainer>
            <BottomButtonContainer>
              <PinkButton style={{ width: "120px" }} href="/papercups/listen">
                I want to listen!
              </PinkButton>
            </BottomButtonContainer>
          </BirdPairContainer>
          <PinkButton href="/papercups/conversations">Conversations</PinkButton>
        </SaneBlock>
      </PageContent>
    </Page>
  );
};

const PaperCupsImage = styled.div`
  position: relative;
  background: url(${PaperCupsPNG}) no-repeat;
  background-position: center;
  background-size: contain;

  @media (max-height: 700px) {
    height: 0px;
  }

  @media (min-height: 701px) {
    height: 220px;
  }
`;

const BirdPairContainer = styled.div`
  position: relative;
  height: 300px;
  background: url(${BirdPairPNG}) no-repeat;
  background-size: contain;
  background-position: center;
  margin-left: 36px;
  margin-right: 36px;
`;

const TopButtonContainer = styled.div`
  position: absolute;
  right: 50%;
  top: 10%;
  transform: translate(125%, 0%);
`;

const BottomButtonContainer = styled.div`
  position: absolute;
  left: 50%;
  bottom: 10%;
  transform: translate(-125%, 0%);
`;

export default PaperCupsHome;
