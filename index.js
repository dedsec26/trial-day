const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Users = require("./models/users");
const Creds = require("./models/credentials");
const jwt = require("jsonwebtoken");

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

app.listen(4000, () => console.log("Server Started on : 4000"));

app.get("/register", (req, res) => res.send("Success"));
app.get("/data/:email", async (req, res) => {
  // console.log(req.params.email);
  try {
    let data = await Users.findOne({ email: req.params.email });
    res.json(data);
  } catch (error) {
    res.send({ message: "Server Error." });
  }
});

app.post("/register", async (req, res) => {
  // console.log(req.body);
  // res.json(req.body);
  // console.log(req.body.name);
  console.log(req.body.email);
  // console.log(req.body.pass);
  const availability = await Users.findOne({ email: req.body.email });
  // console.log(availability);
  if (availability) {
    res.json("Email already exist in the database. Please login.");
  } else {
    let user = new Users({ name: req.body.name });
    user.name = req.body.name;
    user.email = req.body.email;
    user.pass = req.body.pass;
    console.log(user);
    await user.save();
    res.json("user successfully created!!!");
  }
});

// Logging in portion is made only because it can be copied from the
// buying tokens sections. Other than that it has no purpose.
app.post("/login", async (req, res) => {
  // const availability = await Users.findOne({
  //   email: req.body.email,
  //   pass: req.body.pass,
  // });
  // console.log(availability);
  // if (!availability) {
  // res.json("Wrong Credintials. Please login with correct details");
  // } else {

  const role = "user";
  const userId = "1";
  const jwtToken = jwt.sign(
    {
      foo: "bar",
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["admin", "user", "artist"],
        "x-hasura-default-role": role,
        "x-hasura-user-id": userId,
        "x-hasura-wallet-id": "xxx123",
      },
    },
    "hyc8uXLKdx5DfsfnJmTLD6qdkAKLm3vA"
  );
  res.json({
    message: `succesfully logged in!!!`,
    jwtToken,
  });
  // }
});

app.post("/tokens/add", async (req, res) => {
  // console.log(req.body);
  // console.log(typeof req.body.amount);
  let amount = parseInt(req.body.amount);
  const availability = await Users.findById(req.body.id);
  if (!availability) {
    res.json("Account does not exist.");
  } else {
    availability.tokens = availability.tokens + amount;
    await availability.save();
    res.json(`You succesfully added ${req.body.amount} tokens!!!`);
  }
});

app.post("/cred/buy", async (req, res) => {
  req.setTimeout(10000);
  const availability = await Users.findById(req.body.id);
  // console.log(req.body.id);
  if (!availability) {
    res.status(400).json("Account does not exist.");
  } else {
    if (availability.tokens < req.body.creds) {
      needed = req.body.creds - availability.tokens;
      res
        .status(400)
        .json(
          `You do not have enough credits to buy ${req.body.creds} credentials. You need ${needed} more tokens. Please topup first.`
        );
    } else {
      // const finData = [];
      // for (let i = 0; i < req.body.creds; i++) {
      //   // console.log("here");
      //   let data = await Creds.find({ status: 1 }).limit(req.body.creds);
      //   finData.push(data);
      //   // data.status = 0;
      //   // data.save();
      // }
      let count = await Creds.countDocuments({ status: 1 });
      if (count < req.body.creds) {
        res
          .status(400)
          .json(
            `You have requested ${req.body.creds} credentials and we only have ${count} in store. Try reducing your requested amount.`
          );
      } else {
        let data = await Creds.find({ status: 1 }).limit(req.body.creds);
        availability.tokens = availability.tokens - req.body.creds;
        await availability.save();
        console.log(data);
        // for (const i of data) {
        //   i.status = 0;
        //   i.save();
        // }

        res.json(data);
      }
    }
  }
});
