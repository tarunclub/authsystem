require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 8001;

// DATABASE CONNECTION
mongoose
  .connect(process.env.MONGODB_URL)
  .then(console.log("DB CONNECTION SUCCESSFULL"))
  .catch((error) => {
    console.log("Database connection FAILED");
    console.log(error);
    process.exit;
  });

// Middlewares
app.use(express.json());

// Requests
app.get("/", (req, res) => {
  res.send("<h1>Hello from tarun</h1>");
});

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!(email && password && firstName && lastName)) {
      res.status(404).send("All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(401).send("User already exists");
    }

    const myEncPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: myEncPassword,
    });

    // token
    const token = jwt.sign(
      { user_id: user.user_id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;
    user.password = undefined;

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

// Server running
app.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});
