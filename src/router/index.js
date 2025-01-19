import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import FuncionarioDashboard from "../views/FuncionarioDashboard.vue";
import JefaturaDashboard from "../views/JefaturaDashboard.vue";
import AdminDashboard from "../views/AdminDashboard.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  { path: "/admin-dashboard", component: AdminDashboard },
  { path: "/jefatura-dashboard", component: JefaturaDashboard },
  { path: "/funcionario-dashboard", component: FuncionarioDashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
