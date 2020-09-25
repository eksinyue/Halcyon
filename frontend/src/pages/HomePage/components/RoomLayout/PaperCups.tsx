import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { Link } from "framework7-react";
import PaperCupImage from "../../assets/paper_cup.png";
import { forNotSmall, forSmall, strokeOutline } from "./css-helpers";

const PaperCups = styled(Link)`
  display: block;
  background: url(${PaperCupImage}) no-repeat;
  background-size: 100% 100%;
  position: absolute;
  right: 30%;
  transform: translate(50%, 0);
  bottom: 7%;

  ${forSmall(css`
    width: 90px;
    height: 120px;
  `)}

  ${forNotSmall(css`
    width: 130px;
    height: 180px;
  `)}

  ${strokeOutline}
`;

export default PaperCups;
