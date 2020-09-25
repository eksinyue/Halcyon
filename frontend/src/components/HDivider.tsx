import React from "react";
import { FlexRow, HRule } from "./layout";
import styled from "@emotion/styled";

const MainChild = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  width: 100%;
`;

const HDivider: React.FC<{}> = ({ children }) => {
  return (
    <FlexRow className="mt-2 mb-2 fullwidth blue-text">
      <HRule />
      <MainChild className="mr-2 ml-2">{children}</MainChild>
      <HRule />
    </FlexRow>
  );
};

export default HDivider;
