import { Icon } from "framework7-react";
import React from "react";
import { FlexRow } from "../../../components/layout";

interface Props {
  temperature?: number;
}

const TemperatureLabel: React.FC<Props> = ({ temperature }) => {
  return temperature ? (
    <FlexRow className="align-items-center">
      <Icon f7="thermometer_fill" size="1rem" className="mr-3" />
      <div>{temperature.toFixed(1)}°C</div>
    </FlexRow>
  ) : null;
};

export default TemperatureLabel;
