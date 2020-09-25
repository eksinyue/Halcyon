import styled from "@emotion/styled";
import { Block, Page, PageContent } from "framework7-react";
import React from "react";
import Colors from "../../colors";
import SaneBlock from "../../components/SaneBlock";
import SimpleTopBar from "../../components/SimpleTopBar";
import BirbImage from "../HomePage/assets/bird_logo.png";

const AboutPage = () => {
  return (
    <Page
      style={{ backgroundColor: Colors.primaryLighter }}
      pageContent={false}
      className="blue-text"
    >
      <SimpleTopBar back="/" />
      <PageContent>
        <Bird />
        <SaneBlock>
          <Header>Hi,</Header>
          <p className="text-3">
            Halcyon is a self-care application for putting your mind and soul at
            ease through daily journaling and spontaneous voice messages with
            others.
          </p>
          <p className="text-3">
            Just like how "halcyon" means calm and peaceful, with Halcyon, we
            hope that we can provide you with a calm and peaceful space where
            you can care for yourself.
          </p>
          <p className="mt-4">Wishing you the very best,</p>
          <p className="text-1 m-0">The Halcyon team</p>
        </SaneBlock>
      </PageContent>
    </Page>
  );
};

const Header = styled.h1`
  font-size: 48px;
`;

const Bird = styled.div`
  height: 200px;
  background-image: url(${BirbImage});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

export default AboutPage;
