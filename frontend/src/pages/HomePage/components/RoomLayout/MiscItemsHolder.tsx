import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";
import SFXPlayer from "../../../../music/SFXPlayer";
import DiffuserImage from "../../assets/diffuser.png";
import PenHolderImage from "../../assets/stationery.png";
import { forNotSmall, forSmall, nonInteractable } from "./css-helpers";
import PensSFX from "../../sfx/pens.mp3";
import DiffuserSFX from "../../sfx/diffuser.mp3";

const MiscItemsHolderContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  height: 20%;
  top: -12%;
  right: 25%;
`;

const Diffuser = styled.a`
  width: 35px;
  height: 100px;
  display: block;
  background: url(${DiffuserImage}) no-repeat;
  background-size: 100% 100%;

  ${forSmall(css`
    height: 110px;
    width: 40px;
  `)}

  ${forNotSmall(css`
    height: 150px;
    width: 60px;
  `)}
`;

const PenHolder = styled.a`
  width: 40px;
  height: 80px;
  display: block;
  background: url(${PenHolderImage}) no-repeat;
  background-size: 100% 100%;
  transform: translate(10%, 0);

  ${forSmall(css`
    height: 100px;
    width: 40px;
  `)}

  ${forNotSmall(css`
    height: 130px;
    width: 60px;
  `)}
`;

export default () => (
  <MiscItemsHolderContainer>
    <PenHolder
      onClick={() => {
        SFXPlayer.play(PensSFX);
      }}
    />
    <Diffuser
      onClick={() => {
        SFXPlayer.play(DiffuserSFX);
      }}
    />
  </MiscItemsHolderContainer>
);
