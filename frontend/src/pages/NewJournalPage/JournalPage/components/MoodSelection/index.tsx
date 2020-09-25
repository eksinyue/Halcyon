import styled from "@emotion/styled";
import React from "react";
import MoodIcons from "../../../../../components/MoodIcons";
import SaneBlock from "../../../../../components/SaneBlock";
import SFXPlayer from "../../../../../music/SFXPlayer";
import { JournalEntry, Mood } from "../../../types";
import MoodButton from "./MoodButton";
import PopSFX from "./pop.mp3";

interface Props {
  journalEntry: Partial<JournalEntry>;
  setJournalEntry: (entry: Partial<JournalEntry>) => void;
}

const MoodContainers = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const moods = [
  {
    icon: MoodIcons.Happy,
    text: "happy",
    mood: Mood.Happy,
  },
  {
    icon: MoodIcons.Relaxed,
    text: "relaxed",
    mood: Mood.Relaxed,
  },
  {
    icon: MoodIcons.Sad,
    text: "sad",
    mood: Mood.Sad,
  },
  {
    icon: MoodIcons.Tired,
    text: "tired",
    mood: Mood.Tired,
  },
  {
    icon: MoodIcons.Stressed,
    text: "stressed",
    mood: Mood.Stressed,
  },
  {
    icon: MoodIcons.Angry,
    text: "angry",
    mood: Mood.Angry,
  },
];

const MoodSelection: React.FC<Props> = ({ journalEntry, setJournalEntry }) => {
  const setMood = (mood: Mood) => {
    setJournalEntry({
      ...journalEntry,
      mood,
    });
  };

  return (
    <>
      <p className="blue-text text-2">How are you feeling today?</p>
      <MoodContainers>
        {moods.map((mood) => (
          <div style={{ width: "calc(100% / 3)" }} key={mood.mood}>
            <MoodButton
              icon={mood.icon}
              text={mood.text}
              active={journalEntry.mood === mood.mood}
              onClick={() => {
                setMood(mood.mood);
                SFXPlayer.play(PopSFX);
              }}
            />
          </div>
        ))}
      </MoodContainers>
    </>
  );
};

export default MoodSelection;
