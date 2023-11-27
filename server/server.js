import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

await mongoose
  .connect("mongodb://localhost:27017/notesDB")
  .catch((error) => console.log(error));

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Note = mongoose.model("note", noteSchema);

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.post("/addNote", async (req, res) => { 
  let data = req.body;
  const note = new Note({ ...data });
  console.log(note)
  await note.save().catch((error) => console.log(error));
  res.status(200).send("Note added sucessfully");
});

app.get("/allNotes", async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
});

app.delete("/deletenote/:id", async (req, res) => {
    let id = req.params.id;
    await Note.deleteOne({ _id: id }).catch((error) =>
    console.log(error)
    );
    const notes = await Note.find()
    res.status(200).json(notes);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
