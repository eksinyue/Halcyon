import { format } from "date-fns/esm";
import { Block } from "framework7-react";
import React from "react";
import { FlexRow } from "../../../../components/layout";
import LocationLabel from "../../Preamble/LocationLabel";
import WeatherLabel from "../../Preamble/WeatherLabel";
import TemperatureLabel from "../../Preamble/TemperatureLabel";
import MoodRenderer from "../../ReadJournalPage/components/MoodRenderer";
import { JournalEntry } from "../../types";

interface Props {
  entry: JournalEntry;
}

const DetailedJournalView: React.FC<Props> = ({ entry }) => {
  return (
    <div className="blue-text mt-4">
      <FlexRow className="justify-content-space-between align-items-center">
        <p className="text-2">
          <strong>{format(entry.createdAt, "do MMMM yyyy")}</strong>{" "}
        </p>
        <MoodRenderer mood={entry.mood} size={66} />
      </FlexRow>
      <WeatherLabel weather={entry.weather} />
      <LocationLabel location={entry.location} />
      <TemperatureLabel temperature={entry.temperature} />
      {/* <p className='text-1 mt-2 mt-3'>On this day,</p>
      <div className='mb-4'>
        <p className='text-3'>Prompt: {entry.block.prompt}</p>
      </div>
      <p className='text-4 m-0'>Yours truly,</p>
      <p className='text-2 m-0'>Me</p> */}

      <div className="pt-5" style={{ boxSizing: "border-box" }}>
        <p className="blue-text text-2 mt-1 mb-1">{entry.block.prompt}</p>

        <p className="text-2">{entry.block.content}</p>
      </div>
    </div>
  );
};

export default DetailedJournalView;
