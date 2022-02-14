const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Users = require("./models/users");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let monogConnctionUri =
  "mongodb+srv://admin:admin@cluster0.toiih.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(monogConnctionUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo Connection Successful"))
  .catch((err) => console.log(err.message));

app.listen(3000, () => console.log("Server Started on : 3000"));

app.get("/register", (req, res) => res.send("Success"));

app.post("/register", async (req, res) => {
  //   console.log(req.body.name);
  //   console.log(req.body.email);
  //   console.log(req.body.pass);
  const availability = await Users.findOne({ email: req.body.email });
  if (availability) {
    res.send("Email already exist in the database. Please login.");
  } else {
    let user = new Users({ name: req.body.name });
    user.name = req.body.name;
    user.email = req.body.email;
    user.pass = req.body.pass;
    console.log(user);
    await user.save();
    res.send("user successfully created!!!");
  }
});
