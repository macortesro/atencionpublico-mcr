<template>
  <header class="header">
    <h1>BICRIM SAN BERNARDO</h1>
    <button class="login-btn" @click="$emit('open-login-modal')">Iniciar Sesión</button>
  </header>
</template>


<style scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #003366;
  color: white;
  padding: 1rem 2rem;
  position: relative;
}

.header h1 {
  font-size: 1.8rem;
  margin: 0;
}

.login-btn {
  position: absolute; /* Permite posicionarlo a la derecha */
  right: 2rem;
  background-color: white;
  color: #003366;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background-color: #f0f0f0;
}
</style>
