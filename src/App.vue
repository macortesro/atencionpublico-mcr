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
    submitLogin() {
      console.log("Intentando iniciar sesión con:", this.loginData);
      this.closeModal();
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
