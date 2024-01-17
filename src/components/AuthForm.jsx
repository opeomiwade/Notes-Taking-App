import React from "react";
import {
  Form,
  useParams,
  json,
  redirect,
  useActionData,
  useNavigate,
} from "react-router-dom";
import Input from "./Input";
import axios from "axios";
import { motion } from "framer-motion";

function AuthForm() {
  const { auth } = useParams();
  const error = useActionData();
  const navigate = useNavigate();

  function handleClick() {
    if (auth == "login") {
      navigate("/signup");
    } else {
      navigate("/login");
    }
  }

  return (
    <Form method="POST" className="form">
      <Input
        labelName="E-mail"
        className="auth"
        name="username"
        type="email"
        required
      />

      <Input
        labelName="Password"
        className="auth"
        name="password"
        required
        type="password"
      />
      {error && error.isError && (
        <motion.div
          className="errorDiv"
          initial={{ x: 0, opacity: 0 }}
          animate={{ opacity: 1, x: [-10, 0, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <p>{error.errorInfo.message}</p>
        </motion.div>
      )}
      <motion.button
        whileHover={{ scale: 1.2, backgroundColor: "yellowgreen" }}
        transition={{ type: "spring", stiffness: 200 }}
        className="login"
      >
        {auth.charAt(0).toUpperCase() + auth.slice(1)}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "orangered" }}
        transition={{ type: "spring", stiffness: 200 }}
        className="switch"
        onClick={handleClick}
        type="button"
      >
        {auth === "login" ? "To Signup" : "To Login"}
      </motion.button>
    </Form>
  );
}

export async function action({ request, params }) {
  const data = await request.formData();
  const userData = Object.fromEntries(data.entries());

  if (params.auth === "signup") {
    try {
      const response = await axios.post(
        "http://localhost:3001/signup",
        userData
      );
      if (response.data.authToken) {
        localStorage.setItem("authToken", response.data.authToken);
        return redirect("/notes");
      }
      return response.data;
    } catch (error) {
      console.log(error);
      const errorInfo = error.response.data.err;
      console.log(errorInfo);
      return json({ errorInfo, isError: true });
    }
  } else {
    console.log("here");
    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        userData
      );
      console.log(response);
      if (response.data.authToken) {
        localStorage.setItem("authToken", response.data.authToken);
        return redirect("/notes");
      }
      return response.data;
    } catch (error) {
      const errorInfo = error.response.data.info;
      return json({ errorInfo, isError: true });
    }
  }
}

export default AuthForm;
