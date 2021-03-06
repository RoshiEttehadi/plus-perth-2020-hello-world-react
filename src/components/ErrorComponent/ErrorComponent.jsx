import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./ErrorComponent.css";

function ErrorComponent(props) {
  const { errorMessage, errorNumber } = props;

  return (
    <div className="c">
      <div className="ErrorMessageContainer">
        <div className="_404">{errorNumber}</div>
        <br></br>
        <div className="_1">{errorMessage}</div>
      </div>
    </div>
  );
}
export default ErrorComponent;
