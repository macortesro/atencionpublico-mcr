const mongoose = require('mongoose');

const DailyCounterSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Fecha en formato YYYY-MM-DD
  tipo_tramite: { type: String, required: true }, // Consulta, Citación, Denuncia
  count: { type: Number, required: true, default: 0 }, // Contador diario
});

module.exports = mongoose.model('DailyCounter', DailyCounterSchema);
