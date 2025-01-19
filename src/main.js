import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import "./assets/styles.css";
import { io } from 'socket.io-client';

const socket = io('import.meta.env.VITE_API_URL'); // URL del servidor para IO

const app = createApp(App);

app.provide('socket', socket); // Proveer socket globalmente
app.use(router).mount('#app');
