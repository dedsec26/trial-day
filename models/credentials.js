let Mongoose = require("mongoose");
const { Schema } = Mongoose;

const credsSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 1,
  },
});

module.exports = Mongoose.model("Creds", credsSchema);
