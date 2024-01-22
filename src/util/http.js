import { QueryClient } from "@tanstack/react-query";
import { json } from "react-router-dom";
import axios from "axios";

export async function getNotes() {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get("http://localhost:3001/allNotes", {
      headers: { Authorization: `Bearer ${token} ` },
    });
    return response.data;
  } catch (error) {
    throw json(error);
  }
}

export async function addNote(note) {
  try {
    const token = localStorage.getItem("authToken");
    console.log(token);
    const response = await axios.post("http://localhost:3001/addNote", note, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw json({ error });
  }
}

const queryClient = new QueryClient();

export default queryClient;
