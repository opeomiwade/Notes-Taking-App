import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import passportLocalMongoose from "passport-local-mongoose";
import passport from "passport";

const app = express();
const port = 3001;

function checkUser(req, res, next) {
  const token = req.headers["authorization"].split(" ")[1];
  const userCredentials = jwt.verify(token, "secretkey12456754");
  req.body.username = userCredentials.username;
  req.body.password = userCredentials.password;
  next();
}

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

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    min: 6,
  },
  notes: [noteSchema],
});

usersSchema.plugin(passportLocalMongoose);
const Note = mongoose.model("note", noteSchema);
const User = mongoose.model("user", usersSchema);

passport.use(User.createStrategy());

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.post("/addNote", checkUser, async (req, res) => {
  passport.authenticate("local", async (err, user, info) => {
    if (user) {
      console.log(user);
      let data = req.body;
      const note = new Note({ ...data.note });
      await User.findByIdAndUpdate(user._id, { $push: { notes: note } });
      res.status(200).send("Note added sucessfully");
    } else {
      console.log(info);
      res.status(401).json({ message: "Unauthorized" });
    }
  })(req, res);
});

app.get("/allNotes", checkUser, async (req, res) => {
  const user = await User.find({ username: req.body.username });
  const notes = user[0].notes;
  res.status(200).json(notes);
});

app.delete("/deletenote/:id", checkUser, async (req, res) => {
  let noteId = req.params.id;
  passport.authenticate("local", async (err, user, info) => {
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        $pull: { notes: { _id: noteId } },
      }).catch((error) => console.log(error));
      res.status(200).send("Note deleted sucessfully");
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  })(req, res);

});

app.post("/signup", (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.status(500).json({ err });
      } else {
        passport.authenticate("local")(req, res, () => {
          const token = jwt.sign(
            { username: req.body.username, password: req.body.password },
            "secretkey12456754",
            { expiresIn: "2h" }
          );
          res.status(200).json({
            message: "User create and logged In succesfully",
            authToken: token,
          });
        });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
