import { Block, f7, Page, PageContent } from "framework7-react";
import React, { useState } from "react";
import { changePassword } from "../../../api";
import { OfflineError } from "../../../api/errors";
import Colors from "../../../colors";
import { YellowButton } from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import SaneBlock from "../../../components/SaneBlock";
import SimpleTopBar from "../../../components/SimpleTopBar";
import ToastService from "../../../services/ToastService";
import CustomizableNameplate from "../CustomizableNameplate";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const doChangePassword = async (e: any) => {
    e.preventDefault();
    if (newPassword !== repeatNewPassword) {
      ToastService.toastBottom(`The passwords don't match.`);
      return;
    }

    setLoading(true);
    try {
      await changePassword(newPassword);
      ToastService.toastBottom("Successfully changed password!");
      f7.views.main.router.navigate("/profile");
    } catch (e) {
      if (e instanceof OfflineError) {
        ToastService.toastBottom(
          "You can only change your password while you are online."
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
        <form onSubmit={doChangePassword}>
          <SaneBlock>
            <div className="mb-2">
              <label className="blue-text">New Password</label>
              <CustomInput
                placeholder="new password"
                value={newPassword}
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="blue-text">Repeat New Password</label>
              <CustomInput
                placeholder="repeat new password"
                value={repeatNewPassword}
                type="password"
                onChange={(e) => setRepeatNewPassword(e.target.value)}
              />
            </div>
            <YellowButton
              type="submit"
              className="mt-4 fullwidth"
              loading={loading}
            >
              change password
            </YellowButton>
          </SaneBlock>
        </form>
      </PageContent>
    </Page>
  );
};

export default ChangePassword;
