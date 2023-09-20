import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { Zoom } from "@mui/material";



function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: ""
  });
  const [clicked , setClicked] = useState(false);


  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function submitNote(event) {
    props.onAdd(note);
    setNote({
      title: "",
      content: ""
    });
    event.preventDefault();
  }

  return (
    <div>
      <form className="create-note">
        <input
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
          onClick={() =>{
            setClicked(true);
          }}
        />

        {clicked ? 
        <textarea
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows="3"
        /> : null} 
        
        
        <Zoom in = {clicked} >
           <Fab onClick={submitNote}>
            <AddIcon/> 
          </Fab>
        </Zoom>
       
        
      </form>
    </div>
  );
}

export default CreateArea;
