const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: String,
  usuario: { type: String, required: true },
  password: { type: String, required: true },
  rol: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema, "usuarios");
