import styled from "@emotion/styled";

export const HRule = styled.div`
  width: 100%;
  height: 0px;
  border: 1px solid hsl(0, 0%, 85%);
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const HCenteredRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const VCenteredCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;
