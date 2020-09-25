import { f7 } from "framework7-react";
import { useEffect } from "react";
import LocalDatabase from "../utils/LocalDatabase";

const useIfNotLoggedIn = () => {
  useEffect(() => {
    (async () => {
      const result = await LocalDatabase.getAuthToken();
      const isGuestAccountAndOffline = await LocalDatabase.isGuestAccountQueued();
      if (!result && !isGuestAccountAndOffline) {
        f7.views.main.router.navigate("/login");
      }
    })();
  }, []);
};

export default useIfNotLoggedIn;
