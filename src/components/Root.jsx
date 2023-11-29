import React from "react";
import Header from "./Header"
import { Outlet,useParams } from "react-router";

function Root() {
const {auth} = useParams()
const title = auth != undefined ? auth.charAt(0).toUpperCase() + auth.slice(1) : "Notes"
  return (
    <>
      <Header title={title} />
      <Outlet />
    </>
  );
}

export default Root
