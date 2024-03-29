import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import passportLocalMongoose from "passport-local-mongoose";
import passport from "passport";
import findOrCreate from "mongoose-findorcreate";
import session from "express-session";
import "dotenv/config";

const app = express();
const port = 3001;

function checkUser(req, res, next) {
  const token = req.headers["authorization"].split(" ")[1];
  const userCredentials = jwt.verify(token, "secretkey12456754");
  req.body.username = userCredentials.username;
  req.body.password =
    userCredentials.password !== undefined
      ? userCredentials.password
      : "defaultPassword";
  next();
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(
  session({
    secret: process.env.SECRET, // Replace with a strong, randomly generated secret
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

await mongoose
  .connect(
    `mongodb+srv://ope_admin:${process.env.ATLAS_KEY}@cluster0.72hfjc0.mongodb.net/userDB`
  )
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
usersSchema.plugin(findOrCreate);
const Note = mongoose.model("note", noteSchema);
const User = mongoose.model("user", usersSchema);

passport.use(User.createStrategy());
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.post("/addNote", checkUser, async (req, res) => {
  passport.authenticate("local", async (err, user, info) => {
    if (user) {
      let data = req.body;
      const note = new Note({ ...data.note });
      await User.findByIdAndUpdate(user._id, { $push: { notes: note } });
      res.status(200).send("Note added sucessfully");
    } else {
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
    (err, user, info) => {
      if (err) {
        res.status(500).json({ err });
      } else {
        passport.authenticate("local")(req, res, () => {
          const token = jwt.sign(
            { username: req.body.username, password: req.body.password },
            "secretkey12456754",
            { expiresIn: "2h" }
          );
          res.status(200).json({
            message: "User created and logged In succesfully",
            authToken: token,
          });
        });
      }
    }
  );
});

app.post("/login", (req, res) => {
  passport.authenticate("local", async (err, user, info) => {
    if (user) {
      const token = jwt.sign(
        {
          username: req.body.username,
          password: req.body.password,
        },
        "secretkey12456754",
        { expiresIn: "2h" }
      );
      res.status(200).json({ message: "User logged In", authToken: token });
    } else {
      res.status(404).json({ info });
    }
  })(req, res);
});

app.get("/auth/login/google", (req, res) => {
  passport.authenticate("google", { scope: ["profile"] })(req, res);
});

app.get(
  "/oauth2/redirect",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  function (req, res) {
    const token = jwt.sign(
      { username: req.user.username, password: "google" },
      "secretkey12456754",
      { expiresIn: "2h" }
    );
    res.redirect(`http://localhost:3000/notes?token=${token}`);
  }
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
