import { Block, Page, PageContent } from "framework7-react";
import React, { useEffect, useState } from "react";
import { getAllConvos } from "../../../api";
import Colors from "../../../colors";
import SimpleTopBar from "../../../components/SimpleTopBar";
import { VCenteredCol } from "../../../components/layout";
import ConversationEntry from "./ConversationEntry";
import { OfflineError } from "../../../api/errors";
import ToastService from "../../../services/ToastService";
import { PinkButton } from "../../../components/CustomButton";
import { capitalCase, snakeCase } from "change-case";
import LocalDatabase from "../../../utils/LocalDatabase";
import SaneBlock from "../../../components/SaneBlock";

interface Conversation {
  id: string; // convoId
  userId: string; // otherparty ID
  alias: string;
}

const mapper = (convo: {
  id: string;
  otherPartyId: string;
  otherPartyAlias: string;
}) => ({
  id: convo.id,
  userId: convo.otherPartyId,
  alias: convo.otherPartyAlias,
});

const PaperCupsConversations = () => {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false); // TODO: loading state
  useEffect(() => {
    (async () => {
      const cachedConvos = await LocalDatabase.getConversations();
      if (cachedConvos) {
        setConvos(cachedConvos.map(mapper));
      }
      setLoading(true);
      try {
        const conversations = await getAllConvos();
        if (conversations) {
          setConvos(conversations.map(mapper));
        }
      } catch (e) {
        if (e instanceof OfflineError) {
          ToastService.toastBottom(
            `We can't connect you to the server. Check your internet connection.`
          );
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <Page
      style={{ backgroundColor: Colors.secondaryLight }}
      pageContent={false}
    >
      <SimpleTopBar back="/papercups" />
      <PageContent>
        <SaneBlock style={{ height: "85%" }}>
          <h1 className="text-1 blue-text">
            <strong>Conversations</strong>
          </h1>
          {convos.length === 0 ? (
            <VCenteredCol className="text-align-center">
              <p className="text-2 blue-text">
                <strong>No available conversations.</strong>
              </p>
              <p className="text-3 blue-text">
                Listen to paper cups and start a conversation now.
              </p>
              <PinkButton href="/papercups/listen">
                Listen to a random person
              </PinkButton>
            </VCenteredCol>
          ) : (
            convos.map((convo, i) => (
              <ConversationEntry
                key={i}
                id={convo.id}
                avatarUrl={`https://api.adorable.io/avatars/285/${snakeCase(
                  convo.alias
                )}.png`}
                name={capitalCase(convo.alias || "Anonymous")}
                unreadCount={0}
              />
            ))
          )}
        </SaneBlock>
      </PageContent>
    </Page>
  );
};

export default PaperCupsConversations;
