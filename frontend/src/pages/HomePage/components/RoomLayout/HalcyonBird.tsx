import { css, keyframes } from "@emotion/core";
import styled from "@emotion/styled";
import HalcyonBirdImage from "../../assets/bird.png";
import { forNotSmall, forSmall, strokeOutline } from "./css-helpers";

const SqueezeKeyframes = keyframes`
  from {
    transform: translate(-50%, 0) skew(0, 0);
  }

  to {
    transform: translate(-50%, 0) skew(6deg, 6deg);
  }
`;

const HalcyonBird = styled.a`
  display: block;
  background: url(${HalcyonBirdImage}) no-repeat;
  background-size: 100% 100%;
  position: absolute;
  left: 25%;
  transform: translate(-50%, 0);
  bottom: 5%;

  &:active,
  &:focus {
    animation: ${SqueezeKeyframes} 0.2s;
  }

  ${forSmall(css`
    width: 130px;
    height: 70px;
  `)}

  ${forNotSmall(css`
    width: 150px;
    height: 77px;
  `)}

  ${strokeOutline}
`;

export default HalcyonBird;
