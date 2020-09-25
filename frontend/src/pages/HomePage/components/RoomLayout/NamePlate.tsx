import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { Icon, Link } from "framework7-react";
import React from "react";
import NamePlateImage from "../../assets/name_plate.png";
import {
  forNotSmall,
  forSmall,
  strokeOutline,
  swayAnimation,
  SwayProps,
} from "./css-helpers";

const NamePlate = styled(Link)`
  display: block;
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(-130%, 10%);
  z-index: 0;

  ${forSmall(css`
    height: 160px;
    width: 90px;
  `)}

  ${forNotSmall(css`
    height: 210px;
    width: 110px;
    bottom: 550px;
  `)}

  ${strokeOutline}
`;

const InnerNamePlate = styled.div<SwayProps>`
  position: relative;
  width: 100%;
  height: 100%;
  background: url(${NamePlateImage}) no-repeat;
  background-size: 100% 100%;
  ${(props) => swayAnimation(props.loopDuration, props.deg, props.delay)}
`;

const ContentHolder = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 50%;
  top: 50%;
  transform: translate(50%, -10%);

  ${forSmall(css`
    height: 60px;
    width: 60px;
    font-size: 1rem;
  `)}

  ${forNotSmall(css`
    width: 80px;
    height: 80px;
    font-size: 1.2rem;
  `)}
`;

export default () => (
  <NamePlate href="/profile">
    <InnerNamePlate
      loopDuration={Math.floor(Math.random() * 10) + 10}
      deg={3}
      delay={Math.floor(Math.random() * 6) + 2}
    >
      <ContentHolder className="blue-text text-2 text-align-center">
        Relax. It'll be fine.
      </ContentHolder>
    </InnerNamePlate>
  </NamePlate>
);
