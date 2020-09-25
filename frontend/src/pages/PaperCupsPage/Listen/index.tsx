import styled from "@emotion/styled";
import { Block, f7, Page, PageContent } from "framework7-react";
import React, { useEffect, useState } from "react";
import { animated, useTransition } from "react-spring";
import {
  getUnopenedMessageCount,
  getUnopenedSound,
  newConversationWith,
} from "../../../api";
import { OfflineError } from "../../../api/errors";
import Colors from "../../../colors";
import SimpleTopBar from "../../../components/SimpleTopBar";
import ToastService from "../../../services/ToastService";
import EmptyState from "./EmptyState";
import ListeningBirbPNG from "./ListeningBirb.png";
import ListeningState from "./ListeningState";
import PickCupState from "./PickCupState";
import ReplyState from "./ReplyState";

enum Route {
  PickCup,
  Listen,
  Empty,
  Reply,
}

const ListenPage = () => {
  const [currentSound, setCurrentSound] = useState<{
    url: string;
    userId: string;
    messageId: string;
  }>();
  const [route, setRoute] = useState<Route>(Route.PickCup);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [replyBlob, setReplyBlob] = useState<Blob | null>(null);
  const [listened, setListened] = useState(false); // whether user has listened at least once
  const [loading, setLoading] = useState(false); // multipurpose loading state
  const [countLoading, setCountLoading] = useState(true);
  const [unopenedCount, setUnopenedCount] = useState(0);

  const getCount = async () => {
    try {
      setCountLoading(true);
      const number = await getUnopenedMessageCount();
      setUnopenedCount(number);
      if (number === 0) {
        setRoute(Route.Empty);
      } else {
        setRoute(Route.PickCup);
      }
    } catch (e) {
      // do nothing
      setRoute(Route.Empty);
    } finally {
      setCountLoading(false);
    }
  };

  const chooseAnother = () => {
    setCurrentSound(undefined);
    wavesurfer?.stop();
    setListened(false);
    setRoute(Route.PickCup);
  };

  const getNewSound = async () => {
    setLoading(true);
    try {
      const result = await getUnopenedSound();
      if (result === null) {
        // means no unopened sounds
        return false;
      }
      setCurrentSound(result);
      return true;
    } catch (e) {
      if (e instanceof OfflineError) {
        ToastService.toastBottom(
          `This feature is only available when you're online.`
        );
      }
    } finally {
      setLoading(false);
    }
    return false;
  };

  const openNewSound = async () => {
    setListened(false);
    const start = Date.now();
    const success = await getNewSound();
    const diff = (Date.now() - start) / 1000;
    if (diff > 0.3) {
      if (success) {
        setRoute(Route.Listen);
      } else {
        setRoute(Route.Empty);
      }
    } else {
      setTimeout(() => {
        if (success) {
          setRoute(Route.Listen);
        } else {
          setRoute(Route.Empty);
        }
      }, 300);
    }
  };

  const goToReply = () => {
    setRoute(Route.Reply);
    setReplyBlob(null);
  };

  const replyToMessage = async () => {
    if (!replyBlob || !currentSound) {
      return;
    }

    setLoading(true);

    try {
      await newConversationWith({
        userId: currentSound.userId,
        messageId: currentSound.messageId,
        blob: replyBlob,
      });
      ToastService.toastBottom(`Your message is on its way!`);
      f7.views.main.router.navigate("/papercups/conversations");
    } catch (e) {
      if (e instanceof OfflineError) {
        ToastService.toastBottom(
          "This feature is unavailable while offline. Go online to finish your upload!"
        );
      } else {
        ToastService.toastBottom("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const transitions = useTransition(route, (r) => r, {
    from: {
      opacity: 0,
      transform: "translate3d(100%, 0, 0)",
      position: "absolute",
    },
    enter: {
      opacity: 1,
      transform: "translate3d(0%, 0, 0)",
      position: "relative",
    },
    leave: {
      opacity: 0,
      transform: "translate3d(-50%, 0, 0)",
      position: "absolute",
    },
  });

  const renderPage = () => {
    return transitions.map(({ item, props, key }) => {
      return (
        <animated.div style={props} key={key} className="mt-4 mb-4 fullwidth">
          {item === Route.Empty ? (
            <EmptyState />
          ) : item === Route.Listen ? (
            <ListeningState
              setListened={setListened}
              listened={listened}
              url={currentSound?.url}
              chooseAnother={chooseAnother}
              wavesurfer={wavesurfer}
              setWavesurfer={setWavesurfer}
              onReply={goToReply}
              loading={loading}
            />
          ) : item === Route.PickCup ? (
            <PickCupState
              openNewSound={openNewSound}
              unopenedCount={unopenedCount}
            />
          ) : item === Route.Reply ? (
            <ReplyState
              replyBlob={replyBlob}
              setReplyBlob={setReplyBlob}
              onReply={replyToMessage}
              loading={loading}
            />
          ) : null}
        </animated.div>
      );
    });
  };

  useEffect(() => {
    getCount();
  }, []);

  return (
    <Page
      style={{ backgroundColor: Colors.secondaryLight }}
      className="blue-text"
      pageContent={false}
    >
      <SimpleTopBar back="/papercups" />
      <PageContent>
        <ListeningBirb />
        <h1 className="text-align-center">I want to listen!</h1>
        <Block
          style={{ maxWidth: "400px", margin: "0 auto", position: "relative" }}
        >
          {countLoading ? (
            <p className="text-2 text-align-center">We are finding messages~</p>
          ) : (
            renderPage()
          )}
        </Block>
      </PageContent>
    </Page>
  );
};

const ListeningBirb = styled.div`
  height: 350px;
  background: url(${ListeningBirbPNG}) no-repeat;
  background-size: contain;
  background-position: center;
`;

export default ListenPage;
