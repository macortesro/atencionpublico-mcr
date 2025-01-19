const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Para generar tokens de sesión
const User = require("../models/User"); // Modelo de usuario
const router = express.Router();

// Ruta para el inicio de sesión
router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;
  console.log("Usuario recibido desde la solicitud:", usuario);
  try {
    // Buscar usuario por nombre de usuario
    const user = await User.findOne({ usuario });
    if (!user) {
    console.log("Usuario no encontrado en la base de datos:", usuario);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar la contraseña con el hash almacenado
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET || "claveSecreta",
      { expiresIn: "1h" }
    );

    // Responder con el token y los datos del usuario
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      usuario: user.usuario,
      rol: user.rol,
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
});

module.exports = router;
