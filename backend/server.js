const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./db');
const Tramite = require('./models/Tramite'); // Importa el modelo
const tramitesRouter = require('./routes/tramites');
const cors = require("cors");
const authRouter = require("./routes/auth");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://bicrimsbe.netlify.app", // URL exacta del cliente
    methods: ["GET", "POST"],
    credentials: true,
  },
});


// Conectar a MongoDB
connectDB();

// Middleware
app.use(express.json());

app.use(cors({
  origin: 'https://bicrimsbe.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Pasar io al middleware para usarlo en las rutas
app.use((req, res, next) => {
    req.io = io; // SocketIO disponible en las rutas
    next();
});

// Rutas
app.use("/api/tramites", tramitesRouter);
app.use("/api/auth", authRouter);

// SocketIO para conexión de clientes
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// Ruta básica
app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
