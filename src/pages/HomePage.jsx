import React from "react";
import { useLoaderData,redirect } from "react-router";
import Footer from "../components/Footer";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";
import { useQuery, useMutation } from "@tanstack/react-query";
import queryClient, { getNotes, addNote } from "../util/http";
import axios from "axios";

function HomePage() {
  const notesData = useLoaderData();
  console.log(notesData);

  const { data } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
    staleTime: 5000,
  });
  console.log(data);

  const { mutate } = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  function addNoteHandler(note) {
    mutate({ note: note });
  }

  async function deleteNote(id) {
    const token = localStorage.getItem("authToken");
    await axios.delete(`http://localhost:3001/deletenote/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    queryClient.invalidateQueries();
  }

  return (
    <div>
      <CreateArea onAdd={addNoteHandler} />
      {data.map((noteItem) => {
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

export async function loader() {
  if (!localStorage.getItem("authToken")) {
    return redirect("/");
  }
  return queryClient.fetchQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
    staleTime: 5000,
  });
}

export default HomePage;
