import { css } from "@emotion/core";
import styled from "@emotion/styled";
import LightsImage from "../../assets/light.png";
import { forNotSmall, forSmall, nonInteractable } from "./css-helpers";

const Lights = styled.div`
  position: absolute;
  top: 0px;
  left: 50%;
  background: url(${LightsImage}) no-repeat;
  background-size: 100% 100%;
  transform: translate(-115%, 0);
  ${nonInteractable}

  ${forSmall(css`
    height: 160px;
    width: 160px;
  `)}

  ${forNotSmall(css`
    height: 200px;
    width: 200px;
  `)}

  ${nonInteractable}
`;

export default Lights;
