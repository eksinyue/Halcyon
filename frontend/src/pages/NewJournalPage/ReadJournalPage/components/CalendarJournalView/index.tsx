import styled from "@emotion/styled";
import {
  addMonths,
  getDate,
  getDay,
  getDaysInMonth,
  lastDayOfMonth,
} from "date-fns";
import { Button } from "framework7-react";
import React, { useMemo } from "react";
import Colors from "../../../../../colors";
import { FlexRow } from "../../../../../components/layout";
import MoodIcons from "../../../../../components/MoodIcons";
import { JournalEntry, Mood } from "../../../types";

interface Props {
  entries: JournalEntry[];
  monthYear: [number, number]; // [month, year]
  toNextMonth: () => void;
  toPrevMonth: () => void;
}

const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarJournalView: React.FC<Props> = ({
  entries,
  monthYear: [month, year],
  toNextMonth,
  toPrevMonth,
}) => {
  // Get first day of month to do calculations
  const firstDayOfMonth = useMemo(() => {
    return new Date(year, month, 1, 0, 0, 0);
  }, [month, year]);

  // First day as a day of week: 0 = Sunday, 6 = Saturday
  const firstDay = useMemo(() => {
    return getDay(firstDayOfMonth);
  }, [firstDayOfMonth]);

  const lastDay = useMemo(() => {
    return getDay(lastDayOfMonth(firstDayOfMonth));
  }, [firstDayOfMonth]);

  // Number of days in the month
  const daysInMonth = useMemo(() => {
    return getDaysInMonth(firstDayOfMonth);
  }, [firstDayOfMonth]);

  const daysInPrevMonth = useMemo(() => {
    return getDaysInMonth(addMonths(firstDayOfMonth, -1));
  }, [firstDayOfMonth]);

  // Get all days into their respective bins
  const bins = useMemo(() => {
    return Array.from(
      Array(daysInMonth + firstDay + (6 - lastDay)).keys()
    ).reduce(
      (result: number[][], n) => {
        const resultDay = n % 7;
        const clone = [...result];
        clone[resultDay].push(n - firstDay);
        return clone;
      },
      [[], [], [], [], [], [], []]
    );
  }, [firstDay, daysInMonth, lastDay]);

  const journalBins = useMemo(() => {
    const entryBins: (JournalEntry | undefined)[] = Array.from(
      Array(daysInMonth).keys()
    ).map((_) => undefined);
    entries.forEach((entry) => {
      const dayOfMonth = getDate(entry.createdAt) - 1;
      entryBins[dayOfMonth] = entry;
    });
    return entryBins;
  }, [daysInMonth, entries]);

  const renderCircle = (singleDay: number) => {
    const entry = journalBins[singleDay];
    if (entry === undefined) {
      return (
        <>
          <div className="text-align-center blue-text">{singleDay + 1}</div>
          <Circle color={Colors.primaryTint} />
        </>
      );
    }
    let moodSrc = MoodIcons.Happy;
    switch (entry.mood) {
      case Mood.Happy:
        moodSrc = MoodIcons.Happy;
        break;
      case Mood.Sad:
        moodSrc = MoodIcons.Sad;
        break;
      case Mood.Stressed:
        moodSrc = MoodIcons.Stressed;
        break;
      case Mood.Angry:
        moodSrc = MoodIcons.Angry;
        break;
      case Mood.Tired:
        moodSrc = MoodIcons.Tired;
        break;
      case Mood.Relaxed:
        moodSrc = MoodIcons.Relaxed;
        break;
    }
    return (
      <>
        <div className="text-align-center blue-text">{singleDay + 1}</div>
        {entry.mood === undefined || entry.mood === null ? (
          <Circle color={Colors.primaryTint} />
        ) : (
          <MoodCircle
            className="no-padding"
            src={moodSrc}
            href={`/journal/entries/${entry.id || entry.tempId}`}
          />
        )}
      </>
    );
  };

  return (
    <FlexRow className="justify-content-space-between">
      {daysOfTheWeek.map((day, i) => (
        <div key={day}>
          <p
            className="text-align-center blue-text text-2"
            style={{ textTransform: "lowercase" }}
          >
            {day}
          </p>
          {bins[i].map((singleDay) => {
            return (
              <DateContainer key={singleDay}>
                {singleDay < 0 ? (
                  <>
                    <div className="text-align-center text-color-gray">
                      {singleDay + daysInPrevMonth}
                    </div>
                    <Circle color={Colors.primaryLight} onClick={toPrevMonth} />
                  </>
                ) : singleDay >= daysInMonth ? (
                  <>
                    <div className="text-align-center text-color-gray">
                      {singleDay - daysInMonth + 1}
                    </div>
                    <Circle color={Colors.primaryLight} onClick={toNextMonth} />
                  </>
                ) : (
                  renderCircle(singleDay)
                )}
              </DateContainer>
            );
          })}
        </div>
      ))}
    </FlexRow>
  );
};

const DateContainer = styled.div`
  height: 64px;
`;

const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid ${(props) => props.color};
`;

const MoodCircle = styled(Button)<{ src: string }>`
  width: 100%;
  height: 34px;
  background: url(${(props) => props.src}) no-repeat;
  background-size: contain;
  background-origin: center;
`;

export default CalendarJournalView;
