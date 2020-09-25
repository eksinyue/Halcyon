import { Icon } from "framework7-react";
import React from "react";
import Colors from "../../../../../colors";
import { MutedButton } from "../../../../../components/CustomButton";
import { JournalBlock } from "../../../types";
import styled from "@emotion/styled";

interface Props {
  journalBlock: JournalBlock;
  setJournalBlock: (block: JournalBlock) => void;
  randomizePrompt: () => void;
}

const PromptWriting: React.FC<Props> = ({
  journalBlock,
  setJournalBlock,
  randomizePrompt,
}) => {
  const saveWriting = (content: string) => {
    setJournalBlock({
      ...journalBlock,
      content,
    });
  };

  return (
    <div>
      <p className="blue-text text-2 mt-1 mb-1">{journalBlock.prompt}</p>
      <MutedButton onClick={randomizePrompt} className="mt-2 mb-2">
        <Icon f7="shuffle" className="mr-3" size="20px" />
        Change Prompt
      </MutedButton>
      <CustomTextArea
        value={journalBlock.content}
        onChange={(e) => saveWriting(e.target.value)}
        rows={7}
        className="p-3 fullwidth"
      />
    </div>
  );
};

const CustomTextArea = styled.textarea`
  background-color: ${Colors.journalPage};
  color: ${Colors.primaryDark};
  border-radius: 8px;
`;

export default PromptWriting;
