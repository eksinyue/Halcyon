import { useEffect, useState } from "react";
import useLocation from "./useLocation";
import axios from "axios";

// DO NOT STEAL! XDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD who has time to setup this
const API_KEY = "07386abb9de56ce2cecf5a4626b0e226";

const useWeather = () => {
  const location = useLocation();
  const [weather, setWeather] = useState<string | undefined>(undefined);
  const [temp, setTemp] = useState<number | undefined>(undefined);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!location.isReady) {
      return;
    }

    (async () => {
      try {
        const result = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${API_KEY}`
        );
        const weatherResult = result.data.weather[0];
        const tempResult = result.data.main;
        setWeather(weatherResult.main);
        setTemp(Math.floor((tempResult.temp - 273.15) * 10) / 10);
        setIsReady(true);
      } catch (e) {
        // do nothing
      }
    })();
  }, [location.isReady, location.lat, location.lng]);

  return { weather, temp, isReady };
};

export default useWeather;
