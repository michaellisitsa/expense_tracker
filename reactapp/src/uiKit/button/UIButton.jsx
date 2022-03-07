import React from "react";
import styled from "styled-components";

const Button = (props) => (
  <ButtonRoot onClick={props.onClick} selected={props.selected}>
    <ButtonContent>{props.children}</ButtonContent>
  </ButtonRoot>
);

const ButtonRoot = styled.button`
  display: inline-flex;
  align-items: center;
  border: 2px solid grey;
  border-radius: 8px;
  background: ${(props) => (props.selected ? "lightblue" : "white")};

  &:hover {
    background-color: lightblue;
    cursor: pointer;
    box-shadow: 2px 4px 3px #888888;
  }
`;

const ButtonContent = styled.span`
  padding: 1em;
  font-weight: 700;

  &:active {
    transform: scale(90%);
  }
`;

export default Button;
