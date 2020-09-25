import { css } from "@emotion/core";
import styled from "@emotion/styled";
import TableImage from "../../assets/table.png";
import { forNotSmall, forSmall } from "./css-helpers";

const Table = styled.div`
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translate(-49%, 20%);
  background: url(${TableImage}) no-repeat;
  background-size: 100% 100%;

  ${forSmall(css`
    width: 460px;
    height: 300px;
  `)}

  ${forNotSmall(css`
    width: 800px;
    height: 450px;
  `)}
`;

export default Table;
