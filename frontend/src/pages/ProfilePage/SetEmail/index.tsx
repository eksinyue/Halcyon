import { Block, f7, Page, PageContent } from "framework7-react";
import React, { useState } from "react";
import { changeEmail } from "../../../api";
import { OfflineError } from "../../../api/errors";
import Colors from "../../../colors";
import { YellowButton } from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import SaneBlock from "../../../components/SaneBlock";
import SimpleTopBar from "../../../components/SimpleTopBar";
import ToastService from "../../../services/ToastService";
import CustomizableNameplate from "../CustomizableNameplate";

const SetEmail = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const doChangeEmail = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await changeEmail(email);
      ToastService.toastBottom("Successfully set email!");
      f7.views.main.router.navigate("/profile");
    } catch (e) {
      if (e instanceof OfflineError) {
        ToastService.toastBottom(
          "You can only change your email while you are online."
        );
      } else {
        ToastService.toastBottom("Something wrong happened.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page style={{ backgroundColor: Colors.tertiaryLight }} pageContent={false}>
      <SimpleTopBar back="/profile" />
      <PageContent>
        <CustomizableNameplate content="My own room" />
        <form onSubmit={doChangeEmail}>
          <SaneBlock>
            <div className="mb-2">
              <label className="blue-text">New Email</label>
              <CustomInput
                placeholder="new email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <YellowButton
              type="submit"
              className="mt-4 fullwidth"
              loading={loading}
            >
              change email
            </YellowButton>
          </SaneBlock>
        </form>
      </PageContent>
    </Page>
  );
};

export default SetEmail;
