import styled from "@emotion/styled";
import React from "react";
import BirdPNG from "../HomePage/assets/bird.png";
import NamePlatePNG from "../HomePage/assets/name_plate.png";

interface Props {
  content: string;
}

const CustomizableNameplate: React.FC<Props> = ({ content }) => {
  return (
    <NamePlateContainer className="mb-3">
      <Bird />
      <InnerContent className="blue-text text-align-center text-2">
        {content}
      </InnerContent>
    </NamePlateContainer>
  );
};

const NamePlateContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background-image: url(${NamePlatePNG});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

const Bird = styled.div`
  position: absolute;
  background-image: url(${BirdPNG});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  height: 60px;
  width: 90px;
  right: 50%;
  top: 50%;
  transform: translate(75%, -130%);
`;

const InnerContent = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  right: 50%;
  top: 50%;
  transform: translate(50%, -10%);
`;

export default CustomizableNameplate;
