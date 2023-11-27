import React from "react";
import { Form, useParams } from "react-router-dom";
import Input from "./Input";

function AuthForm() {
  const {auth} = useParams();
  return (
    <Form className="form">
      <Input labelName="E-mail" className="auth" />

      <Input labelName="Password" className="auth" />

      <button type="submit">{auth.charAt(0).toUpperCase() + auth.slice(1)}</button>
    </Form>
  );
}

export default AuthForm;
