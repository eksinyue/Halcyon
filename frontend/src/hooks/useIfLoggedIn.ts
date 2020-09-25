import { f7 } from "framework7-react";
import { useEffect } from "react";
import { reauthenticate } from "../api";
import LocalDatabase from "../utils/LocalDatabase";

const useIfLoggedIn = () => {
  useEffect(() => {
    (async () => {
      const result = await LocalDatabase.getAuthToken();
      const isGuestAccount = await LocalDatabase.isGuestAccountQueued();
      if (isGuestAccount) {
        f7.views.main.router.allowPageChange = true;
        f7.views.main.router.navigate("/");
      }
      if (result) {
        try {
          await reauthenticate(result.refreshToken);
          f7.views.main.router.allowPageChange = true;
          f7.views.main.router.navigate("/");
        } catch (e) {
          // not logged in properly?
        }
      }
    })();
  }, []);
};

export default useIfLoggedIn;
