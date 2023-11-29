import React from "react";
import { Form, useParams, json, redirect } from "react-router-dom";
import Input from "./Input";
import axios from "axios";

function AuthForm() {
  const { auth } = useParams();
  return (
    <Form method="POST" className="form">
      <Input labelName="E-mail" className="auth" name="username" type="email"  required/>

      <Input
        labelName="Password"
        className="auth"
        name="password"
        required
        type="password"
      />

      <button className="login">
        {auth.charAt(0).toUpperCase() + auth.slice(1)}
      </button>
    </Form>
  );
}

export async function action({ request, params }) {
  console.log("action")
  const data = await request.formData();
  const userData = Object.fromEntries(data.entries());
  console.log(userData);
  console.log(params.auth);

  if (params.auth === "signup") {
    try {
      const response = await axios.post(
        "http://localhost:3001/signup",
        userData
      );
      if (response.data.authToken) {
        localStorage.setItem("authToken", response.data.authToken)
        return redirect("/notes");
      }
      return response.data;
    } catch (error) {
      throw json({ error });
    }
  } else {
    console.log("here")
    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        userData
      );
      if (response.data.authToken) {
        return redirect("/notes");
      }
      return response.data;
    } catch (error) {
      throw json({ error });
    }
  }
}

export default AuthForm;
