import React from "react";
import styled from "@emotion/styled";
import Colors from "../colors";
import { Button, Icon } from "framework7-react";
import { keyframes } from "@emotion/core";

interface InnerProps {
  color?: string;
  textColor?: string;
  shadowColor?: string;
}

interface Props extends InnerProps {
  loading?: boolean;
}

const InnerCustomButton = styled(Button)<InnerProps>`
  background-color: ${(props) => props.color};
  color: ${(props) => props.textColor} !important;
  box-shadow: 2px 2px ${(props) => props.shadowColor};
  font-family: --f7-font-family;
  text-transform: none;
  font-weight: 600;
  border-radius: 8px;
  padding: 4px 8px;
  height: auto;
  width: auto;

  &:active {
    box-shadow: 0px 0px ${(props) => props.shadowColor};
    transform: translateY(4px);
  }
`;

const rotateKeyframes = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const RotatingIcon = styled(Icon)`
  animation: ${rotateKeyframes} 3s linear infinite;
`;

const CustomButton: React.FC<Button.Props & Props> = ({
  loading,
  children,
  ...props
}) => {
  return (
    <InnerCustomButton {...props} disabled={loading || props.disabled}>
      {loading ? <RotatingIcon f7="arrow_clockwise" className="mr-2" /> : null}
      {children}
    </InnerCustomButton>
  );
};

export const PinkButton: React.FC<Button.Props & Props> = (props) => (
  <CustomButton
    color={Colors.secondary}
    textColor={Colors.primaryDark}
    shadowColor={Colors.secondaryDark}
    {...props}
  />
);

export const YellowButton: React.FC<Button.Props & Props> = (props) => (
  <CustomButton
    color={Colors.tertiary}
    textColor={Colors.primaryDark}
    shadowColor={Colors.tertiaryDark}
    {...props}
  />
);

export const MutedButton: React.FC<Button.Props & Props> = (props) => (
  <CustomButton
    color="transparent"
    textColor={Colors.primaryDark}
    shadowColor="transparent"
    {...props}
  />
);
export default CustomButton;
