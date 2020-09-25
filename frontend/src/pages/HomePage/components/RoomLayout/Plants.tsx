import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";
import PlantsImage from "../../assets/plant.png";
import { forNotSmall, forSmall, swayAnimation, SwayProps } from "./css-helpers";

const Plants = styled.a`
  position: absolute;
  top: 0px;
  right: 30%;
  transform: translate(50%, -5%);

  ${forSmall(css`
    height: 250px;
    width: 150px;
  `)}

  ${forNotSmall(css`
    height: 320px;
    width: 190px;
    right: 42%;
  `)}
`;

const InnerPlants = styled.div<SwayProps>`
  width: 100%;
  height: 100%;
  background: url(${PlantsImage}) no-repeat;
  background-size: 100% 100%;
  ${(props) => swayAnimation(props.loopDuration, props.deg, props.delay)}
`;

export default (props: any) => (
  <Plants {...props}>
    <InnerPlants
      loopDuration={Math.floor(Math.random() * 10) + 10}
      deg={4}
      delay={Math.floor(Math.random() * 2) + 2}
    />
  </Plants>
);
