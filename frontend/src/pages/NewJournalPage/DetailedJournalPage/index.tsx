import { Button, f7, Icon, Navbar, Page, PageContent } from "framework7-react";
import React, { useEffect, useState } from "react";
import { getJournalPost } from "../../../api";
import Colors from "../../../colors";
import LocalDatabase from "../../../utils/LocalDatabase";
import DiaryContainer from "../ReadJournalPage/components/DiaryContainer";
import { JournalEntry } from "../types";
import DetailedJournalView from "./DetailedJournalView";

interface Props {
  id: string;
}

const DetailedJournalPage: React.FC<Props> = ({ id }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  useEffect(() => {
    (async () => {
      const result = await LocalDatabase.getCachedJournalEntry(id);
      if (result) {
        setEntry(result);
      }
      setIsLoading(false);

      // API call
      const newResult = await getJournalPost(id);
      if (newResult) {
        setEntry(newResult);
      }
    })();
  }, [id]);

  const renderContent = () => {
    if (isLoading) {
      return null;
    }

    if (entry === null) {
      f7.views.main.router.navigate("/journal/read");
      return;
    }
    return <DetailedJournalView entry={entry} />;
  };

  return (
    <Page pageContent={false} style={{ backgroundColor: Colors.tertiaryLight }}>
      <Navbar transparent noShadow noHairline className="blue-text">
        <Button back>
          <Icon f7="chevron_left" />
        </Button>
      </Navbar>
      <PageContent>
        <DiaryContainer>{renderContent()}</DiaryContainer>
      </PageContent>
    </Page>
  );
};

export default DetailedJournalPage;
