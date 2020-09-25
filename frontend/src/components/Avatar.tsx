import styled from "@emotion/styled";

interface Props {
  size: number; // Width and height in px
  url: string;
}

const Avatar = styled.div<Props>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  background-image: url(${(props) => props.url});
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
`;

export default Avatar;
