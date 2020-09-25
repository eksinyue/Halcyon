import styled from "@emotion/styled";
import { Page } from "framework7-react";
import React, { useEffect, useState } from "react";
import Colors from "../../colors";
import { PinkButton } from "../../components/CustomButton";
import LocalDatabase, { OnboardingTypes } from "../../utils/LocalDatabase";
import RoomLayout from "./components/RoomLayout";

const HomePage = () => {
  const [showSilentBox, set] = useState(false);
  useEffect(() => {
    (async () => {
      const isSilentOnboarded = await LocalDatabase.isOnboarded(
        OnboardingTypes.Silent
      );
      if (!isSilentOnboarded) {
        set(true);
      }
    })();
  }, []);
  return (
    <Page style={{ backgroundColor: Colors.tertiaryLight }} noNavbar>
      <RoomLayout />
      {showSilentBox ? (
        <OnboardingBackground>
          <OnboardingCard className="blue-text pl-3 pr-3 pt-2 pb-2 text-align-center">
            <h1>Welcome to Halcyon!</h1>
            <p className="text-2">
              Music and sound are integral to the experience, so make sure you
              unmute your device.
            </p>
            <PinkButton
              onClick={() => {
                set(false);
                LocalDatabase.setOnboarding(OnboardingTypes.Silent, true);
              }}
            >
              OK
            </PinkButton>
            :
          </OnboardingCard>
        </OnboardingBackground>
      ) : null}
    </Page>
  );
};

const OnboardingBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OnboardingCard = styled.div`
  border-radius: 16px;
  background-color: ${Colors.tertiary};
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
  margin: 32px;
  z-index: 100;
`;

export default HomePage;
