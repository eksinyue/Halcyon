import React from "react";
import { SwiperSlide, Block } from "framework7-react";
import styled from "@emotion/styled";
import Colors from "../../colors";

interface Props {
  title: string;
  description: string;
  image: string;
}

const OnboardingSlide: React.FC<Props> = ({ title, description, image }) => (
  <SwiperSlide>
    <Block className='ml-4 mr-4' style={{ color: Colors.primaryTint }}>
      <ImageContainer src={image} />
      <p className='text-align-center text-1'>
        <strong>{title}</strong>
      </p>
      <p className='text-align-justify text-3'>{description}</p>
    </Block>
  </SwiperSlide>
);

const ImageContainer = styled.div<{ src: string }>`
  width: 100%;
  height: 350px;
  margin: 0 auto;
  background: url(${(props) => props.src}) no-repeat;
  background-size: contain;
  background-position: center;
`;

export default OnboardingSlide;
