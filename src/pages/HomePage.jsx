import React from "react";
import { redirect } from "react-router";
import Footer from "../components/Footer";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";
import { useQuery, useMutation } from "@tanstack/react-query";
import queryClient, { getNotes, addNote } from "../util/http";
import axios from "axios";
import { AnimatePresence } from "framer-motion";

function HomePage() {
  const { data } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
    staleTime: 5000,
  });

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
      <AnimatePresence mode="sync">
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
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export async function loader({ request }) {
  const googleSignInJWT = new URL(request.url).searchParams.get("token");
  if (googleSignInJWT != undefined) {
    localStorage.setItem("authToken", googleSignInJWT);
  }

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
