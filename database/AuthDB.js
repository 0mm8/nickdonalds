const { Schema, model } = require('mongoose');

module.exports = model("Ahmett", new Schema({
  id: String,
  data: { type: Array }
})) //get away