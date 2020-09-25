import styled from "@emotion/styled";
import Colors from "../colors";

const CustomInput = styled.input`
  outline: none;
  border: none;
  padding: 16px !important;
  width: 100%;
  border-radius: 8px !important;
  font-size: 16px !important;
  box-sizing: border-box;
  font-family: --f7-font-family;
  background-color: ${Colors.tertiary} !important;
  color: ${Colors.primaryDark} !important;

  ::placeholder {
    color: ${Colors.tertiaryDark};
  }
`;

export default CustomInput;
