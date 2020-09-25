import styled from "@emotion/styled";
import { Icon } from "framework7-react";
import React from "react";
import Colors from "../../colors";
import { FlexRow } from "../../components/layout";

interface Props {
  value: boolean;
  toggle: () => void;
  icon: string;
  label: string;
}

const LabeledSwitch: React.FC<Props> = ({ value, toggle, icon, label }) => {
  return (
    <FlexRow
      className="pl-1 pr-1 pt-2 pb-2 border-box fullwidth align-items-center blue-text pointer"
      onClick={toggle}
    >
      <Icon f7={icon} />
      <LabelContainer className="ml-2 mr-2">
        <strong>{label}</strong>
      </LabelContainer>
      <SwitchContainer value={value}>
        <SwitchBall value={value} />
      </SwitchContainer>
    </FlexRow>
  );
};

const SwitchContainer = styled.div<{ value: boolean }>`
  flex-shrink: 0;
  width: 20px;
  height: 8px;
  border-radius: 8px;
  border: 2px solid
    ${(props) => (props.value ? Colors.primaryDark : Colors.primaryLight)};
  padding: 4px;
`;

const LabelContainer = styled.div`
  flex-grow: 1;
`;

const SwitchBall = styled.div<{ value: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.value ? Colors.primaryDark : Colors.primaryLight};
  transform: ${(props) =>
    props.value ? "translate(150%, 0)" : "translate(0%, 0)"};
  transition: 0.3s all;
`;

export default LabeledSwitch;
