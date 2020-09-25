import styled from "@emotion/styled";
import { format } from "date-fns";
import { Button, f7, Icon, Navbar, Page, PageContent } from "framework7-react";
import React, { useEffect, useState } from "react";
import { animated, useTransition } from "react-spring";
import { makeJournalPost } from "../../../api";
import { NotLoggedInError } from "../../../api/errors";
import Colors from "../../../colors";
import { YellowButton } from "../../../components/CustomButton";
import SaneBlock from "../../../components/SaneBlock";
import SimpleTopBar from "../../../components/SimpleTopBar";
import { useCountry } from "../../../hooks/useLocation";
import useWeather from "../../../hooks/useWeather";
import ToastService from "../../../services/ToastService";
import PromptService from "../../../services/PromptService";
import LocalDatabase from "../../../utils/LocalDatabase";
import Preamble from "../Preamble";
import { JournalEntry } from "../types";
import JournalEnd from "./components/JournalEnd";
import MoodSelection from "./components/MoodSelection";
import PromptWriting from "./components/PromptWriting";

const Container = styled(animated.div)`
  position: absolute;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

enum RoutePath {
  Journal,
  End,
}

const JournalPage = () => {
  const [route, setRoute] = useState(RoutePath.Journal);
  const [loading, setLoading] = useState(false);
  const [journalEntry, setJournalEntry] = useState<Partial<JournalEntry>>({
    block: {
      prompt: PromptService.newDailyPrompt(),
      content: "",
    },
  });
  const country: string = useCountry();
  const { weather, temp, isReady } = useWeather();

  useEffect(() => {
    if (country) {
      setJournalEntry((journal) => ({
        ...journal,
        location: country,
      }));
    }
  }, [country]);

  useEffect(() => {
    if (isReady && weather && temp) {
      setJournalEntry((journalEntry) => ({
        ...journalEntry,
        weather,
        temperature: temp,
      }));
    }
  }, [weather, temp, isReady]);

  useEffect(() => {
    (async () => {
      const date = format(new Date(), "yyyy-MM-dd");
      const result = await LocalDatabase.getCachedJournalEntry(date);
      if (result) {
        setJournalEntry(result);
      }
    })();
  }, []);

  const createJournalPost = async () => {
    try {
      setLoading(true);
      await makeJournalPost({
        ...journalEntry,
        createdAt: new Date(),
      } as JournalEntry);
      setRoute(RoutePath.End);
    } catch (e) {
      if (e instanceof NotLoggedInError) {
        ToastService.toastBottom("Not logged in. Log in first.");
        f7.views.main.router.navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const transitions = useTransition(route, (r) => r, {
    from: { opacity: 0, transform: "translate3d(100%, 0, 0)" },
    enter: { opacity: 1, transform: "translate3d(0%, 0, 0)" },
    leave: { opacity: 0, transform: "translate3d(-50%, 0, 0)" },
  });

  const renderContent = () => {
    return transitions.map(({ item: route, props, key }) => {
      let comp: JSX.Element | null = null;
      switch (route) {
        case RoutePath.Journal:
          comp = (
            <SaneBlock>
              <div className="mb-3">
                <Preamble
                  date={new Date()}
                  country={journalEntry.location}
                  weather={journalEntry.weather}
                  temperature={journalEntry.temperature}
                />
              </div>
              <MoodSelection
                journalEntry={journalEntry}
                setJournalEntry={setJournalEntry}
              />
              <PromptWriting
                journalBlock={journalEntry.block!}
                setJournalBlock={(block) =>
                  setJournalEntry((journalEntry) => ({
                    ...journalEntry,
                    block,
                  }))
                }
                randomizePrompt={() =>
                  setJournalEntry((journalEntry) => ({
                    ...journalEntry,
                    block: {
                      prompt: PromptService.newDailyPrompt(),
                      content: "",
                    },
                  }))
                }
              />
              <YellowButton
                className="mt-4"
                onClick={createJournalPost}
                loading={loading}
              >
                I'm Done
              </YellowButton>
            </SaneBlock>
          );
          break;
        case RoutePath.End:
          comp = <JournalEnd homeHref="/" journalHref="/journal/read" />;
          break;
        default:
          comp = <div>No content</div>;
          break;
      }
      return (
        <Container key={key} style={props}>
          {comp}
        </Container>
      );
    });
  };

  return (
    <Page style={{ backgroundColor: Colors.tertiaryLight }} pageContent={false}>
      <SimpleTopBar back="/journal" />
      <PageContent>{renderContent()}</PageContent>
    </Page>
  );
};

export default JournalPage;
