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
    required: false,
  },
  tokens: {
    type: Number,
    default: 3,
  },
});

module.exports = Mongoose.model("Users", usersSchema);
