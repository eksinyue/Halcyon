import styled from "@emotion/styled";
import { format } from "date-fns";
import {
  Block,
  Button,
  Icon,
  Navbar,
  Page,
  PageContent,
} from "framework7-react";
import React, { useEffect, useState } from "react";
import Colors from "../../../colors";
import { Container } from "../../../components/layout";
import { YellowButton } from "../../../components/CustomButton";
import { useCountry } from "../../../hooks/useLocation";
import useWeather from "../../../hooks/useWeather";
import LocalDatabase from "../../../utils/LocalDatabase";
import Preamble from "../Preamble";
import DiaryPNG from "./diary_yellow.png";
import SimpleTopBar from "../../../components/SimpleTopBar";
import SaneBlock from "../../../components/SaneBlock";

const JournalHomePage = () => {
  const country: string = useCountry();
  const { weather, temp } = useWeather();
  const [hasPostToday, setHasPostToday] = useState(false);
  useEffect(() => {
    (async () => {
      const date = format(new Date(), "yyyy-MM-dd");
      const result = await LocalDatabase.getCachedJournalEntry(date);
      if (result) {
        setHasPostToday(true);
      }
    })();
  }, []);

  return (
    <Page
      pageContent={false}
      style={{
        backgroundColor: Colors.tertiaryLight,
      }}
    >
      <SimpleTopBar back="/" />
      <PageContent>
        <Container className="p-4">
          <img
            src={DiaryPNG}
            alt="Diary"
            style={{ width: "300px", height: "300px", objectFit: "contain" }}
          />
          <SaneBlock>
            <Preamble
              date={new Date()}
              country={country}
              weather={weather}
              temperature={temp}
            />
            <div className="mt-4">
              <YellowButton
                className="mt-2 mb-2 fullwidth"
                href="/journal/write"
              >
                {hasPostToday ? "Update Journal" : "Write Journal"}
              </YellowButton>
              <YellowButton href="/journal/read" className="fullwidth">
                View Past Journal
              </YellowButton>
            </div>
          </SaneBlock>
        </Container>
      </PageContent>
    </Page>
  );
};

export default JournalHomePage;
