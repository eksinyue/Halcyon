import styled from "@emotion/styled";
import React from "react";
import Colors from "../../../../../colors";
import { FlexRow } from "../../../../../components/layout";
import SaneBlock from "../../../../../components/SaneBlock";

const Diary = styled.div`
  background-color: ${Colors.journalPage};
  width: 90%;
  height: 100%;
  padding: 16px;
  border-radius: 0px 16px 16px 0px;
  margin-right: 16px;
  box-shadow: 2px 2px 2px 2px ${Colors.journalPageDark};
  box-sizing: border-box;
  overflow-y: auto;
`;

const LeftPage = styled.div`
  background-color: ${Colors.journalPage};
  border-right: 1px solid ${Colors.journalPageDark};
  box-shadow: 2px 2px 2px 2px ${Colors.journalPageDark};
  height: 100%;
  width: 20px;
`;

const DiaryContainer: React.FC<{}> = ({ children }) => {
  return (
    <FlexRow style={{ height: "95%" }}>
      <LeftPage />
      <Diary>
        <SaneBlock>{children}</SaneBlock>
      </Diary>
    </FlexRow>
  );
};

export default DiaryContainer;
