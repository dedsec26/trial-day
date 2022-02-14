let Mongoose = require("mongoose");
const { Schema } = Mongoose;

const usersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  },
  tokens: {
    type: Number,
    default: 0,
  },
});

module.exports = Mongoose.model("Users", usersSchema);
