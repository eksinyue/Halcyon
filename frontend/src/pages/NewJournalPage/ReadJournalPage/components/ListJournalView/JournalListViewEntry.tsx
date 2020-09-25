import { format } from "date-fns";
import { f7 } from "framework7-react";
import React from "react";
import { HCenteredRow } from "../../../../../components/layout";
import { JournalEntry } from "../../../types";
import MoodRenderer from "../MoodRenderer";

interface Props {
  entry: JournalEntry;
}

const JournalListViewEntry: React.FC<Props> = ({ entry }) => {
  return (
    <HCenteredRow
      className='mb-2 align-items-center blue-text pointer'
      onClick={() => {
        f7.views.main.router.navigate(
          `/journal/entries/${format(entry.createdAt, "yyyy-MM-dd")}`
        );
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        className='text-align-center p-2'
      >
        <p className='text-3 m-0'>{format(entry.createdAt, "MMM")}</p>
        <p className='text-1 m-0'>{format(entry.createdAt, "dd")}</p>
      </div>
      <MoodRenderer mood={entry.mood} size={50} />
      <div style={{ flexGrow: 1 }} className='p-2'>
        <p className='text-3'>{entry.block.prompt}</p>
      </div>
    </HCenteredRow>
  );
};

export default JournalListViewEntry;
