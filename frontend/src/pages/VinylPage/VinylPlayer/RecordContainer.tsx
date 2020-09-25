import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { animated } from "react-spring";
import { forNotSmall, forSmall } from "./helpers";

const RecordContainer = styled(animated.div)`
  position: absolute;
  transform: translate(-10%, 0);
  ${forSmall(css`
    width: 200px;
    height: 200px;
  `)}
  ${forNotSmall(css`
    width: 250px;
    height: 250px;
  `)}
`;

export default RecordContainer;
