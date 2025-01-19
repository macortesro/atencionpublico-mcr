const mongoose = require('mongoose');

const TramiteSchema = new mongoose.Schema({
  tipo_tramite: {
    type: String,
    required: true,
    enum: ['Denuncia', 'Consulta', 'Citación'],
  },
  nombre: {
    type: String,
    required: true,
    maxlength: 100,
  },
  run: {
    type: String,
    required: true,
    unique: true,
    maxlength: 12,
  },
  correo: {
    type: String,
    required: true,
    maxlength: 100,
    match: [/.+@.+\..+/, 'Por favor ingrese un correo válido'],
  },
  domicilio: {
    type: String,
    required: true,
    maxlength: 150,
  },
  telefono: {
    type: String,
    required: true,
    maxlength: 15,
  },
  estado: {
    type: Boolean,
    required: true,
    default: false,
  },
  numero_tramite: {
    type: String, 
    unique: true, // único
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
  },
detalle: {
  type: String,
  maxlength: 500,
  default: null, // permite valores nulos
},
funcionario_citador: {
  type: String,
  maxlength: 100,
  default: null, // permite valores nulos
},
});

module.exports = mongoose.model('Tramite', TramiteSchema);
