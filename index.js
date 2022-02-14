const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Users = require("./models/users");
const Creds = require("./models/credentials");

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

// Logging in portion is made only because it can be copied from the
// buying tokens sections. Other than that it has no purpose.
app.post("/login", async (req, res) => {
  const availability = await Users.findOne({
    email: req.body.email,
    pass: req.body.pass,
  });
  console.log(availability);
  if (!availability) {
    res.send("Wrong Credintials. Please login with correct details");
  } else {
    res.send(`${availability.name} succesfully logged in!!!`);
  }
});

app.post("/tokens/add", async (req, res) => {
  const availability = await Users.findOne({
    email: req.body.email,
    pass: req.body.pass,
  });
  if (!availability) {
    res.send("Wrong Credintials. Please login with correct details");
  } else {
    availability.tokens = availability.tokens + req.body.amount;
    await availability.save();
    res.send(
      `${availability.name} succesfully added ${req.body.amount} tokens!!!`
    );
  }
});

app.post("/cred/buy", async (req, res) => {
  const availability = await Users.findOne({
    email: req.body.email,
    pass: req.body.pass,
  });
  if (!availability) {
    res.send("Wrong Credintials. Please login with correct details");
  } else {
    if (availability.tokens < req.body.creds) {
      needed = req.body.creds - availability.tokens;
      res.send(
        `You do not have enough credits to buy ${req.body.creds} credentials. You need ${needed} more tokens. Please recharge first.`
      );
    } else {
      availability.tokens = availability.tokens - req.body.creds;
      await availability.save();
      const finData = [];
      for (let i; i <= req.body.creds; i++) {
        let data = await Creds.findOne({ status: 1 });
        data.status = 0;
        data.save();
        finData.push(data);
      }
      res.send(finData);
    }
  }
});
