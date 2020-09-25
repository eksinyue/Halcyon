import { f7 } from "framework7-react";
import { useEffect, useState } from "react";
import LocalDatabase, { OnboardingTypes } from "../utils/LocalDatabase";

const useOnboarding = (type: OnboardingTypes, onboardingHref: string) => {
  useEffect(() => {
    (async () => {
      const isOnboarded = await LocalDatabase.isOnboarded(type);
      if (!isOnboarded) {
        f7.views.main.router.navigate(onboardingHref);
      }
    })();
  }, [type, onboardingHref]);
};

export const useOnboardingValue = (type: OnboardingTypes) => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  useEffect(() => {
    (async () => {
      const isOnboarded = await LocalDatabase.isOnboarded(type);
      if (!isOnboarded) {
        setIsOnboarded(!!isOnboarded);
      }
    })();
  }, [type]);

  return isOnboarded;
};

export default useOnboarding;
