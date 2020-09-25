import { css } from "@emotion/core";
import styled from "@emotion/styled";
import ChairImage from "../../assets/chair.png";
import { forNotSmall, forSmall, nonInteractable } from "./css-helpers";

const Chair = styled.div`
  position: absolute;
  bottom: 0px;
  left: 50%;
  background: url(${ChairImage}) no-repeat;
  background-size: 100% 100%;
  transform: translate(-70%, 22%);
  ${nonInteractable}

  ${forSmall(css`
    height: 250px;
    width: 250px;
  `)}

  ${forNotSmall(css`
    height: 360px;
    width: 370px;
  `)}
`;

export default Chair;
