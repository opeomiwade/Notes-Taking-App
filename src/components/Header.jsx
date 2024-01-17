import React from "react";
import { useNavigate, useParams } from "react-router";
import NoteIcon from "@mui/icons-material/Note";
import { motion } from "framer-motion";

function Header({ title, ...props }) {
  const navigate = useNavigate();
  const { auth } = useParams();

  function handleLogout() {
    localStorage.removeItem("authToken");
    navigate("/login");
  }

  return (
    <header>
      <h1>
        <NoteIcon />
        {title}
      </h1>
      {!auth && (
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "red" }}
          transition={{ stiffness: 100, type: "spring" }}
          className="logout"
          onClick={handleLogout}
        >
          Log Out
        </motion.button>
      )}
    </header>
  );
}

export default Header;
