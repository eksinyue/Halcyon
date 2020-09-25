import { Icon } from "framework7-react";
import React, { useMemo } from "react";

interface Props {
  weather?:
    | "Thunderstorm"
    | "Drizzle"
    | "Rain"
    | "Snow"
    | "Clear"
    | "Clouds"
    | string;
}

const WeatherIcon: React.FC<Props> = ({ weather }) => {
  const icon = useMemo(() => {
    switch (weather) {
      case "Thunderstorm":
        return "cloud_bolt_rain_fill";
      case "Drizzle":
        return "cloud_drizzle_fill";
      case "Rain":
        return "cloud_heavyrain_fill";
      case "Snow":
        return "snow";
      case "Clear":
        return "sun_max_fill";
      case "Clouds":
        return "cloud_fill";
      default:
        return "cloud_sun_fill";
    }
  }, [weather]);
  return <Icon f7={icon} size="1rem" className="mr-3" />;
};

export default WeatherIcon;
