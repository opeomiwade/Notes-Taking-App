import React, { useRef, useState } from "react";
import {
  Form,
  useParams,
  json,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import Input from "./Input";
import axios from "axios";
import { motion } from "framer-motion";
import GoogleIcon from "@mui/icons-material/Google";

function AuthForm() {
  const { auth } = useParams();
  const error = useActionData();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isDisabled, setIsDisabled] = useState(true);

  function handleClick() {
    if (auth == "login") {
      navigate("/signup");
    } else {
      navigate("/login");
    }
  }

  async function googleLoginHandler(){
    window.location.href = 'http://localhost:3001/auth/login/google'
  }

  function blurHandler() {
    setIsDisabled(
      !emailRef.current.value.trim() || !passwordRef.current.value.trim()
    );
  }

  return (
    <Form method="POST" className="form">
      <Input
        labelName="E-mail"
        className="auth"
        name="username"
        type="email"
        required
        onBlur={blurHandler}
        ref={emailRef}
      />
      <Input
        labelName="Password"
        className="auth"
        name="password"
        required
        type="password"
        onBlur={blurHandler}
        ref={passwordRef}
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
        whileHover={
          isDisabled ? {} : { scale: 1.2, backgroundColor: "yellowgreen" }
        }
        transition={isDisabled ? {} : { type: "spring", stiffness: 200 }}
        disabled={isDisabled}
        className={isDisabled ? "disabled" : "login"}
      >
        {navigation.state == "submitting"
          ? "Loading...."
          : auth.charAt(0).toUpperCase() + auth.slice(1)}
      </motion.button>
      <a className="google-button" onClick={googleLoginHandler}>
        <GoogleIcon />
        Sign In With Google
      </a>
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
