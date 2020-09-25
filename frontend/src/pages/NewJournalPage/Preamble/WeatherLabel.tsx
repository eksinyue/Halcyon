import { Icon } from "framework7-react";
import React, { useMemo } from "react";
import { FlexRow } from "../../../components/layout";

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

const WeatherLabel: React.FC<Props> = ({ weather }) => {
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
  return weather ? (
    <FlexRow className="align-items-center">
      <Icon f7={icon} size="1rem" className="mr-3" />
      <p className="m-0">{weather || "Unknown"}</p>
    </FlexRow>
  ) : null;
};

export default WeatherLabel;
