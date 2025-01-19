<template>
    <div class="confirmation-container">
      <img src="/src/assets/listo.png" alt="Check" class="check-icon" />
      <h2>Trámite ingresado correctamente</h2>
      <p>
        El número asignado corresponde a <strong>{{ numeroTramite }}</strong>.
        <br />
        Guarde este número para su atención.
      </p>
      <button @click="goBack" class="back-btn">Volver al inicio</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      numeroTramite: {
        type: String,
        required: true,
      },
    },
    methods: {
      goBack() {
        this.$emit("goBack");
      },
    },
  };
  </script>
  
  <style scoped>
  .confirmation-container {
    text-align: center;
    padding: 2rem;
  }
  
  .check-icon {
    width: 100px;
    height: 100px;
    margin-bottom: 1rem;
  }
  
  h2 {
    color: #003366;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1rem;
    color: #555;
    margin-bottom: 2rem;
  }
  
  .back-btn {
    background-color: #003366;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .back-btn:hover {
    background-color: #00509e;
  }
  </style>
  