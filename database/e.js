const { Schema, model } = require('mongoose');

module.exports = model("info", new Schema({
  GuildID: String,
  Started: String,
  Author: String,
  Amount: Number,
  Progress: String,
  Type: String,
}))