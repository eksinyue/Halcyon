import { format } from "date-fns/esm";
import React from "react";
import { FlexRow } from "../../../components/layout";
import LocationLabel from "./LocationLabel";
import WeatherLabel from "./WeatherLabel";

interface Props {
  date: Date;
  country?: string;
  temperature?: number;
  weather?: string;
}

const Preamble: React.FC<Props> = ({ date, country, temperature, weather }) => {
  return (
    <FlexRow className="fullwidth align-items-center">
      <div style={{ flexGrow: 1 }} className="text-2 blue-text">
        <strong>{format(date, "do MMMM yyyy")}</strong>
      </div>
      <div className="blue-text">
        <LocationLabel location={country} />
        <WeatherLabel weather={weather} />
      </div>
    </FlexRow>
  );
};

export default Preamble;
