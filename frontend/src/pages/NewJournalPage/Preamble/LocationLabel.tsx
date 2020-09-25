import { Icon } from "framework7-react";
import React from "react";
import { FlexRow } from "../../../components/layout";

interface Props {
  location?: string;
}

const LocationLabel: React.FC<Props> = ({ location }) => {
  return location ? (
    <FlexRow className="align-items-center">
      <Icon f7="location_fill" size="1rem" className="mr-3" />
      <div>{location}</div>
    </FlexRow>
  ) : null;
};

export default LocationLabel;
