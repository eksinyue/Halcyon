import { Button, Icon, Navbar, Page, PageContent } from "framework7-react";
import React, { useState } from "react";
import Colors from "../../../colors";
import DiaryContainer from "./components/DiaryContainer";
import JournalView from "./components/JournalView";

const ReadJournalPage = () => {
  const [isCalView, setIsCalView] = useState(false);
  return (
    <Page
      name="Journal Entries"
      style={{ backgroundColor: Colors.tertiaryLight }}
      pageContent={false}
    >
      <Navbar noHairline noShadow transparent className="blue-text">
        <div className="left">
          <Button href="/journal">
            <Icon f7="chevron_left" />
          </Button>
        </div>
        <div className="right">
          <Button onClick={() => setIsCalView((p) => !p)}>
            <Icon f7={isCalView ? "menu" : "calendar"} />
          </Button>
        </div>
      </Navbar>
      <PageContent>
        <DiaryContainer>
          <JournalView isCalView={isCalView} />
        </DiaryContainer>
      </PageContent>
    </Page>
  );
};

export default ReadJournalPage;
