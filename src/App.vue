<template>
  <div id="app">
    <Header @open-login-modal="openLoginModal" />
    <router-view />
    <Modal
      :isVisible="isModalVisible"
      :title="modalTitle"
      @close="closeModal"
    >
      <template v-if="selectedForm === 'login'">
        <form @submit.prevent="submitLogin">
          <label for="username">Usuario</label>
          <input type="text" id="username" v-model="loginData.username" required />

          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="loginData.password" required />

          <button type="submit">Ingresar</button>
        </form>
      </template>
    </Modal>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Modal from "./components/Modal.vue";
import api from "./api/axios"; 

export default {
  components: { Header, Modal },
  data() {
    return {
      isModalVisible: false,
      modalTitle: "",
      selectedForm: "",
      loginData: {
        username: "",
        password: "",
      },
      user: null, // Almacena los datos del usuario logueado
    };
  },
  methods: {
    openLoginModal() {
      this.isModalVisible = true;
      this.selectedForm = "login";
      this.modalTitle = "Iniciar Sesión";
    },
    closeModal() {
      this.isModalVisible = false;
      this.selectedForm = "";
      this.loginData = { username: "", password: "" };
    },
    async submitLogin() {
      try {
        // Enviar los datos de inicio de sesión al backend
        const response = await api.post("/auth/login", {
          usuario: this.loginData.username,
          password: this.loginData.password,
        });

        console.log("Inicio de sesión exitoso:", response.data);

        // Almacenar token y datos del usuario en localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("usuario", response.data.usuario);
        localStorage.setItem("rol", response.data.rol);

        // Actualizar los datos del usuario logueado
        this.user = {
          usuario: response.data.usuario,
          rol: response.data.rol,
        };

        alert(`Inicio de sesión exitoso. Bienvenido, ${response.data.usuario}.`);
        this.closeModal(); // Cierra el modal

        // Redirigir según el rol del usuario
        if (response.data.rol === "Administrador") {
          this.$router.push("/admin-dashboard");
        } else if (response.data.rol === "Jefatura") {
          this.$router.push("/jefatura-dashboard");
        } else if (response.data.rol === "Funcionario") {
          this.$router.push("/funcionario-dashboard");
        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert("Ocurrió un error al intentar iniciar sesión.");
        }
      }
    },
  },
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f2f5fa;
}
</style>


<style>

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f2f5fa;
}
</style>
