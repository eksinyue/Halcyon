import styled from "@emotion/styled";
import { Button, Icon } from "framework7-react";
import React from "react";
import { MutedButton } from "../../components/CustomButton";
import { FlexRow } from "../../components/layout";

interface Props extends Button.Props {
  icon: string;
}

const LabeledButton: React.FC<Props> = ({ icon, children, ...props }) => {
  return (
    <MutedButton {...props} className="fullwidth">
      <FlexRow className="align-items-center">
        <Icon f7={icon} />
        <LabelContainer className="ml-2 mr-2 text-align-left">
          {children}
        </LabelContainer>
      </FlexRow>
    </MutedButton>
  );
};

const LabelContainer = styled.div`
  flex-grow: 1;
`;

export default LabeledButton;
