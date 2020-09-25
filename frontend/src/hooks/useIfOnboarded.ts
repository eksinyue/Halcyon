import { f7 } from "framework7-react";
import { useEffect } from "react";
import LocalDatabase, { OnboardingTypes } from "../utils/LocalDatabase";

const useIfOnboarded = (type: OnboardingTypes, href: string) => {
  useEffect(() => {
    (async () => {
      const isOnboarded = await LocalDatabase.isOnboarded(type);
      if (isOnboarded) {
        f7.views.main.router.navigate(href);
      }
    })();
  }, [type, href]);
};

export default useIfOnboarded;
