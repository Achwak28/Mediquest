import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const StyledButton = ({ text, type }) => {
  const btnStyle = {
    padding: "1rem 3rem",
    color: "black",
    backgroundColor: "#75dab4",
    borderRadius: "5px",
    fontWeight: "bolder",
    fontSize: "1rem",
    border: "transparent",
  };

  return (
    <div>
      <button type={type} style={btnStyle}>
        {text} {' '} <FaArrowRightLong color="black" />
      </button>
    </div>
  );
};

export default StyledButton;
