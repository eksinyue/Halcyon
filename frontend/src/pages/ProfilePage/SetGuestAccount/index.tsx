import { Block, f7, Page, PageContent } from "framework7-react";
import React, { useState } from "react";
import { changePassword, setGuestAccount } from "../../../api";
import { OfflineError } from "../../../api/errors";
import Colors from "../../../colors";
import { YellowButton } from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import SaneBlock from "../../../components/SaneBlock";
import SimpleTopBar from "../../../components/SimpleTopBar";
import ToastService from "../../../services/ToastService";
import CustomizableNameplate from "../CustomizableNameplate";

const SetGuestAccount = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const doCreateAccount = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setGuestAccount(email, newPassword);
      ToastService.toastBottom("Successfully created account!");
      f7.views.main.router.navigate("/profile");
    } catch (e) {
      if (e instanceof OfflineError) {
        ToastService.toastBottom(
          "You can only create your account while you are online."
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
        <form onSubmit={doCreateAccount}>
          <SaneBlock>
            <div className="mb-2">
              <label className="blue-text">Email</label>
              <CustomInput
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="blue-text">New Password</label>
              <CustomInput
                placeholder="new password"
                value={newPassword}
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <YellowButton
              type="submit"
              className="mt-4 fullwidth"
              loading={loading}
            >
              create account
            </YellowButton>
          </SaneBlock>
        </form>
      </PageContent>
    </Page>
  );
};

export default SetGuestAccount;
