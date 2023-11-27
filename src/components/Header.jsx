import React from "react";
// import NoteIcon from '@mui/icons-material/Note';
function Header({title, ...props}) {
  return (
    <header>
     
        <h1>{title}</h1>
     
    </header>
  );
}

export default Header;
