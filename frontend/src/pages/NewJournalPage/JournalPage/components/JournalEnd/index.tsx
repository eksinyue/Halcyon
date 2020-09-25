import { Block } from "framework7-react";
import React from "react";
import { YellowButton } from "../../../../../components/CustomButton";
import { Container } from "../../../../../components/layout";
import SaneBlock from "../../../../../components/SaneBlock";
import EndPNG from "./end.png";

interface Props {
  homeHref: string;
  journalHref: string;
}

const JournalEnd: React.FC<Props> = ({ homeHref, journalHref }) => {
  return (
    <SaneBlock className="text-align-center">
      <img
        src={EndPNG}
        alt="Diary"
        style={{
          width: "300px",
          height: "300px",
          objectFit: "contain",
        }}
      />
      <h1 className="text-align-center mt-3 text-1 blue-text">Good Job!</h1>
      <Container className="p-3">
        <YellowButton className="mb-3 fullwidth" href={homeHref}>
          Back to Home
        </YellowButton>
        <YellowButton className="fullwidth" href={journalHref}>
          View Past Journal
        </YellowButton>
      </Container>
    </SaneBlock>
  );
};

export default JournalEnd;
