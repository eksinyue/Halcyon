import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React, { useState } from "react";
import { FlexRow } from "../../../components/layout";
import PaperCupPNG from "./Cup.png";

interface Props {
  openNewSound: () => void;
  unopenedCount: number;
}

const PickCupState: React.FC<Props> = ({ openNewSound, unopenedCount }) => {
  const [cupOpen, setCupOpen] = useState<number | null>(null);
  return (
    <>
      <p className="text-align-center text-2 mb-3">
        <strong>Pick a paper cup</strong>
      </p>
      <FlexRow>
        {[...Array(Math.min(unopenedCount, 3))].map((_, i) => (
          <PaperCup
            key={i}
            deg={cupOpen === i ? -30 : 0}
            onClick={() => {
              setCupOpen(i);
              openNewSound();
            }}
          />
        ))}
      </FlexRow>
    </>
  );
};

interface RotateProps {
  deg?: number;
}

const rotateAnimation = (deg: number = 0) => css`
  transform: rotate(${deg}deg);
  transition: 0.5s;
`;

const PaperCup = styled.div<RotateProps>`
  height: 100px;
  width: 100%;
  background: url(${PaperCupPNG}) no-repeat;
  background-size: contain;
  background-position: center;
  cursor: pointer;
  ${(props) => rotateAnimation(props.deg)}
`;

export default PickCupState;
