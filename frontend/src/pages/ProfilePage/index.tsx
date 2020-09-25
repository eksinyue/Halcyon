import { Block, f7, Page, PageContent } from "framework7-react";
import React, { useEffect, useState } from "react";
import { getOwnProfileOnline } from "../../api";
import Colors from "../../colors";
import { MutedButton } from "../../components/CustomButton";
import SaneBlock from "../../components/SaneBlock";
import SimpleTopBar from "../../components/SimpleTopBar";
import MusicPlayer from "../../music/MusicPlayer";
import SFXPlayer from "../../music/SFXPlayer";
import LocalDatabase from "../../utils/LocalDatabase";
import CustomizableNameplate from "./CustomizableNameplate";
import LabeledButton from "./LabeledButton";
import LabeledSwitch from "./LabeledSwitch";
import SwitchSFX from "./switch.mp3";

const ProfilePage = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSFXMuted, setIsSFXMuted] = useState(false);
  const [loaded, setIsLoaded] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    setIsMuted(MusicPlayer.isMuted);
    const id = MusicPlayer.onMute((b) => setIsMuted(b));
    return () => {
      MusicPlayer.removeOnMute(id);
    };
  }, []);

  useEffect(() => {
    setIsSFXMuted(SFXPlayer.isMuted);
    const id = SFXPlayer.onMute((b) => setIsSFXMuted(b));
    return () => {
      SFXPlayer.removeOnMute(id);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const result = await getOwnProfileOnline();
      if (!result) {
        return;
      }

      setIsGuest(result.fbId === null && result.username === null);
      setIsLoaded(true);
    })();
  }, []);

  const logout = async () => {
    const yes = window.confirm(
      "Are you sure you want to do this? All your user preferences and all diary entries that are not synced to the server will be lost!"
    );
    if (yes) {
      await LocalDatabase.clear();
      f7.views.main.router.navigate("/onboarding");
    }
  };

  return (
    <Page style={{ backgroundColor: Colors.tertiaryLight }} pageContent={false}>
      <SimpleTopBar back="/" />
      <PageContent>
        <CustomizableNameplate content="Relax. It'll be fine." />
        <SaneBlock>
          {loaded ? (
            isGuest ? (
              <div>
                <p className="blue-text">
                  You are currently on a guest account. Your data will be lost
                  when you logout, or when your browser data is cleared.
                  Register to claim your account!
                </p>
                <LabeledButton icon="envelope_fill" href="/profile/makeaccount">
                  create account
                </LabeledButton>
              </div>
            ) : (
              <div>
                <LabeledButton icon="envelope_fill" href="/profile/changeemail">
                  change email
                </LabeledButton>
                <LabeledButton icon="lock_fill" href="/profile/changepassword">
                  change password
                </LabeledButton>
              </div>
            )
          ) : null}

          <LabeledSwitch
            value={!isMuted}
            toggle={() => {
              MusicPlayer.toggleMute();
              SFXPlayer.play(SwitchSFX);
            }}
            label="music in the background"
            icon="music_note"
          />

          <LabeledSwitch
            value={!isSFXMuted}
            toggle={() => {
              SFXPlayer.toggleMute();
              SFXPlayer.play(SwitchSFX);
            }}
            label="sound effects"
            icon="radiowaves_right"
          />
          <MutedButton onClick={logout} className="mt-4">
            Logout and clear data
          </MutedButton>
        </SaneBlock>
      </PageContent>
    </Page>
  );
};

export default ProfilePage;
