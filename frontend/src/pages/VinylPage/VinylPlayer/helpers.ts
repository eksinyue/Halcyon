import { SerializedStyles, css } from "@emotion/core";

export const forBreakpoint = (minWidth: number, maxWidth: number) => (
  customCss: SerializedStyles
) => css`
  @media (min-width: ${minWidth}px) and (max-width: ${maxWidth}px) {
    ${customCss}
  }
`;

export const forSmall = forBreakpoint(0, 568);
export const forNotSmall = forBreakpoint(569, 99999);
