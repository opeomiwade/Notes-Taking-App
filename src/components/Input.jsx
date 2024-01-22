import React,{forwardRef} from "react";

const Input = forwardRef(({ labelName, ...props }, ref) => {
  return (
    <>
      <label htmlFor={labelName}>{labelName}</label>
      <input {...props} ref={ref} />
    </>
  );
})

export default Input;
