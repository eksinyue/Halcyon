import { css, keyframes, SerializedStyles } from "@emotion/core";
import Colors from "../../../../colors";

export const strokeOutline = css`
  filter: drop-shadow(2px 2px 0 ${Colors.primaryLighter})
    drop-shadow(-2px 2px 0 ${Colors.primaryLighter})
    drop-shadow(2px -2px 0 ${Colors.primaryLighter})
    drop-shadow(-2px -2px 0 ${Colors.primaryLighter});
`;

export const nonInteractable = css`
  pointer-events: none;
`;

export const forBreakpoint = (minWidth: number, maxWidth: number) => (
  customCss: SerializedStyles
) => css`
  @media (min-width: ${minWidth}px) and (max-width: ${maxWidth}px) {
    ${customCss}
  }
`;

export const forSmall = forBreakpoint(0, 568);
export const forNotSmall = forBreakpoint(569, 99999);
export const forMedium = forBreakpoint(569, 768);
export const forLarge = forBreakpoint(769, 99999);

export interface SwayProps {
  loopDuration: number;
  deg?: number;
  delay?: number;
}

export const swayKeyframes = (deg: number) => keyframes`
  from { 
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-${deg}deg);
  }
  75% {
    transform: rotate(${deg}deg);
  }
  to {
    transform: rotate(0deg);
  }
`;

export const swayAnimation = (
  loopDuration: number,
  deg: number = 8,
  delay: number = 0
) => css`
  animation: ${swayKeyframes(deg)} ${loopDuration}s infinite alternate
    ease-in-out;
  animation-delay: ${delay}s;
  transform-origin: 50% 0;
`;
