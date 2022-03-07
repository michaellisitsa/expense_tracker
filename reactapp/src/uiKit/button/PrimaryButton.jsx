import React from "react";
import UIButton from "./UIButton";
function PrimaryButton(props) {
  return <UIButton {...props}>{props.children}</UIButton>;
}

export default PrimaryButton;
