import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";

function Note(props) {
  function handleClick() {
    props.onDelete(props.id);
  }

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeIn" }}
      exit={{ y: -50, opacity: 0 }}
      className="note"
    >
      <h1>{props.title}</h1>
      <p>{props.content} </p>
      <button onClick={handleClick}>
        <DeleteIcon />
      </button>
    </motion.div>
  );
}

export default Note;
