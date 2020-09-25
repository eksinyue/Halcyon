import styled from "@emotion/styled";
import { Badge, Card, CardContent, f7 } from "framework7-react";
import React from "react";
import Avatar from "../../../components/Avatar";
import { FlexRow } from "../../../components/layout";

interface Props {
  id: string;
  avatarUrl: string;
  name: string;
  unreadCount: number;
}

const ConversationEntry: React.FC<Props> = ({
  id,
  avatarUrl,
  name,
  unreadCount,
}) => {
  return (
    <div
      onClick={() =>
        f7.views.main.router.navigate(`/papercups/conversations/${id}`)
      }
    >
      <Card className="ml-0 mr-0 roundier blue-text">
        <CardContent>
          <FlexRow className="fullwidth align-items-center">
            <Avatar size={64} url={avatarUrl} className="mr-3" />
            <div style={{ flexGrow: 1 }}>
              <p className="m-0 text-2">
                <strong>{name}</strong>
              </p>
            </div>
            {unreadCount > 0 ? (
              <UnreadCountContainer>
                <Badge color="primary">{unreadCount}</Badge>
              </UnreadCountContainer>
            ) : null}
          </FlexRow>
        </CardContent>
      </Card>
    </div>
  );
};

const UnreadCountContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-self: stretch;
`;

export default ConversationEntry;
