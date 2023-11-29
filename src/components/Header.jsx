import React from "react";
// import NoteIcon from '@mui/icons-material/Note';
function Header({title, ...props}) {
  return (
    <header>
     
        <h1>{title}</h1>
        <button onClick={() => localStorage.removeItem("authToken") }>Log Out</button>
     
    </header>
  );
}

export default Header;
