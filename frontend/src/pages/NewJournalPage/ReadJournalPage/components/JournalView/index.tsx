import { getMonth, getYear } from "date-fns";
import { Button, Icon } from "framework7-react";
import React, { useEffect, useMemo, useState } from "react";
import { getJournalPosts } from "../../../../../api";
import { FlexRow } from "../../../../../components/layout";
import SaneBlock from "../../../../../components/SaneBlock";
import LocalDatabase from "../../../../../utils/LocalDatabase";
import { JournalEntry } from "../../../types";
import CalendarJournalView from "../CalendarJournalView";
import ListJournalView from "../ListJournalView";

interface Props {
  isCalView: boolean;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const JournalView: React.FC<Props> = ({ isCalView }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [[month, year], setMonthYear] = useState<[number, number]>([
    getMonth(new Date()),
    getYear(new Date()),
  ]);

  useEffect(() => {
    (async () => {
      const cachedPosts = await LocalDatabase.getCachedJournalPosts();
      setEntries(cachedPosts);
      const posts = await getJournalPosts(year, month);
      setEntries(posts);
    })();
  }, [year, month]);

  const toNextMonth = () => {
    setMonthYear(([month, year]) => {
      if (month === 11) {
        return [0, year + 1];
      }
      return [month + 1, year];
    });
  };

  const toPrevMonth = () => {
    setMonthYear(([month, year]) => {
      if (month === 0) {
        return [11, year - 1];
      }
      return [month - 1, year];
    });
  };

  const monthEntries = useMemo(() => {
    return entries.filter(
      (entry) =>
        getMonth(entry.createdAt) === month && getYear(entry.createdAt) === year
    );
  }, [month, year, entries]);

  return (
    <SaneBlock>
      <FlexRow className="justify-content-center align-items-center blue-text">
        <Button onClick={toPrevMonth}>
          <Icon f7="chevron_left" size="1.5rem" />
        </Button>
        <p className="text-2 blue-text">
          <strong>
            {months[month]} {year}
          </strong>
        </p>
        <Button onClick={toNextMonth}>
          <Icon f7="chevron_right" size="1.5rem" />
        </Button>
      </FlexRow>
      {isCalView ? (
        <CalendarJournalView
          entries={monthEntries}
          toPrevMonth={toPrevMonth}
          toNextMonth={toNextMonth}
          monthYear={[month, year]}
        />
      ) : (
        <ListJournalView entries={monthEntries} />
      )}
    </SaneBlock>
  );
};

export default JournalView;
