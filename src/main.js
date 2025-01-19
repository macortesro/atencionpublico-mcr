import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import "./assets/styles.css";
import { io } from 'socket.io-client';

const socket = io("https://gestion-tramites-bicrimsbe.onrender.com", {
    transports: ["websocket"], // Forzar el uso de WebSocket
    reconnection: true, // Habilitar reconexión automática
  });

const app = createApp(App);

app.provide('socket', socket); // Proveer socket globalmente
app.use(router).mount('#app');

export default socket;