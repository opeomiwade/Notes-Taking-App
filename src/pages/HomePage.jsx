import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";
import axios from "axios";

function HomePage() {
  const [notes, setNotes] = useState([]);

  async function fetchNotes() {
    const response = await axios
      .get("http://localhost:3001/allNotes")
      .catch((error) => console.log(error));
    console.log(response.data);
    setNotes(response.data);
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  async function addNote(newNote) {
    try {
      const response = await axios.post(
        "http://localhost:3001/addNote",
        newNote
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    setNotes((prevNotes) => {
      return [...prevNotes, newNote];
    });
  }

  async function deleteNote(id) {
    const notes = await axios.delete(`http://localhost:3001/deleteNote/${id}`);
    setNotes(notes.data);
  }

  return (
    <div>
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem) => {
        return (
          <Note
            key={noteItem._id}
            id={noteItem._id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default HomePage;
