import React from "react";
import { MutedButton, PinkButton } from "../../../components/CustomButton";

const EmptyState = () => {
  return (
    <div>
      <p className="blue-text text-3">
        Oops, there seems like there are no messages to listen to. :( Perhaps
        try again at a later time. Or maybe you could send a message!
      </p>
      <PinkButton href="/papercups/speak" className="mb-2">
        Record
      </PinkButton>
      <MutedButton href="/papercups">Back</MutedButton>
    </div>
  );
};

export default EmptyState;
