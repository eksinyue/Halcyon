import { css } from "@emotion/core";
import styled from "@emotion/styled";
import CarpetImage from "../../assets/carpet.png";
import { forNotSmall, forSmall } from "./css-helpers";

const Carpet = styled.div`
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translate(-50%, 50%);
  background: url(${CarpetImage}) no-repeat;
  background-size: 100% 100%;

  ${forSmall(css`
    width: 130%;
    height: 120px;
  `)}

  ${forNotSmall(css`
    width: 1000px;
    height: 200px;
  `)}
`;

export default Carpet;
