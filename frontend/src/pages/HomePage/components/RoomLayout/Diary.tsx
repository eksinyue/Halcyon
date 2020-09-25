import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { Link } from "framework7-react";
import DiaryImage from "../../assets/diary_yellow.png";
import { forNotSmall, forSmall, strokeOutline } from "./css-helpers";

const Diary = styled(Link)`
  display: block;
  position: absolute;
  right: 30%;
  top: 8%;
  background: url(${DiaryImage}) no-repeat;
  background-size: 100% 100%;
  ${strokeOutline}

  ${forSmall(css`
    width: 96px;
    height: 72px;
  `)}

  ${forNotSmall(css`
    width: 150px;
    height: 100px;
  `)}
`;

export default Diary;
