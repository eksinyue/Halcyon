import React, { useEffect, useState } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import WindowImage from "../../assets/window.png";
import DaytimeWindowImage from "../../assets/window_daytime.png";
import NightWindowImage from "../../assets/window_night.png";
import { forNotSmall, forSmall } from "./css-helpers";
import { getHours } from "date-fns";

const DumbWindow = styled.div<{ src: string }>`
  position: absolute;
  left: 50%;
  background: url(${(props) => props.src}) no-repeat;
  background-size: 100% 100%;
  transform: translate(0%, -25%);
  transition: 0.5s all;

  ${forSmall(css`
    width: 250px;
    height: 350px;
    bottom: 320px;
  `)}

  ${forNotSmall(css`
    width: 350px;
    height: 550px;
    bottom: 350px;
    left: 52%;
  `)}
`;

const Window: React.FC<{ dark: boolean }> = ({ dark, ...props }) => {
  const src = dark ? NightWindowImage : DaytimeWindowImage;

  return <DumbWindow src={src} {...props} />;
};

export default Window;
