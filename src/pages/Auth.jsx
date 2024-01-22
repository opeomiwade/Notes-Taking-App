import React from "react";
import AuthForm from "../components/AuthForm";

function AuthPage() {
  return <AuthForm />;
}

export function loader(){
  localStorage.removeItem("authToken")
  return null
}

export default AuthPage;
