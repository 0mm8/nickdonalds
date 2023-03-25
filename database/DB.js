const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: { type: String,  },
  
  accessToken: { type: String,  },
  refreshToken: { type: String,},

});

const User = mongoose.model("conflict", UserSchema);

module.exports = User;