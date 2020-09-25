import { isBefore } from "date-fns";
import React, { useMemo } from "react";
import { JournalEntry } from "../../../types";
import { VCenteredCol } from "../../../../../components/layout";
import JournalListViewEntry from "./JournalListViewEntry";

interface Props {
  entries: JournalEntry[];
}

const ListJournalView: React.FC<Props> = ({ entries }) => {
  const sortedMonthEntries = useMemo(() => {
    return [...entries].sort((a, b) =>
      isBefore(a.createdAt, b.createdAt) ? 1 : -1
    );
  }, [entries]);
  return (
    <>
      {sortedMonthEntries.length === 0 ? (
        <VCenteredCol className='text-align-center'>
          <p className='text-2 blue-text'>
            <strong>No journal entries yet</strong>
          </p>
          <p className='text-3 blue-text'>
            Self-reflection helps you have a more positive outlook and build
            resilience for tough times.
          </p>
          <p className='text-3 blue-text'>
            Start your journalling habit with Halcyon today!
          </p>
        </VCenteredCol>
      ) : (
        sortedMonthEntries.map((entry, i) => (
          <JournalListViewEntry entry={entry} key={i} />
        ))
      )}
    </>
  );
};

export default ListJournalView;
