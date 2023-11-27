import React from "react";

function Input({ labelName, ...props }) {
  return (
    <>
      <label htmlFor={labelName}>{labelName}</label>

      <input {...props} />
    </>
  );
}

export default Input;
