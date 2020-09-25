import React from "react";
import { Block, BlockTitle, Icon } from "framework7-react";
import LabeledItem from "./LabeledItem";

const JournalPage = () => {
  return (
    <Block>
      <BlockTitle>20 November 2019</BlockTitle>
      <LabeledItem icon="sun_max" text="Sunny, 27 degrees" />
      <LabeledItem icon="globe" text="Singapore" />
      <p className="text-1 mt-2 mb-0">Dear Diary,</p>
      <p className="text-3">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores,
        provident perspiciatis autem dolor dignissimos aliquam nesciunt harum
        tenetur impedit iure voluptates atque sint soluta eos tempora nam?
        Eligendi, molestiae autem!
      </p>
      <p className="text-4">Yours truly,</p>
      <p className="text-2">Andrea</p>
    </Block>
  );
};

export default JournalPage;
