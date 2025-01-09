<template>
    <div class="home">
        <div class="main-content">
            <h2>Seleccione el Trámite a Realizar</h2>
      <div class="cards-container">
        <div class="card" @click="openModal('denuncia')">
          <img src="/src/assets/denuncia-icon.png" alt="Denuncia" class="card-icon" />
          <h3>DENUNCIA</h3>
          <p>Quiero realizar una denuncia</p>
        </div>
        <div class="card" @click="openModal('consulta')">
          <img src="/src/assets/consulta-icon.png" alt="Consulta" class="card-icon" />
          <h3>CONSULTA DE ANTECEDENTES</h3>
          <p>Deseo conocer mis antecedentes para viajes y otros</p>
        </div>
        <div class="card" @click="openModal('citacion')">
          <img src="/src/assets/citacion-icon.png" alt="Citacion" class="card-icon" />
          <h3>CITACIÓN</h3>
          <p>Me citó un funcionario policial</p>
        </div>
      </div>
        </div>
  
      <!-- Modal -->
      <Modal
        :isVisible="isModalVisible"
        :title="modalTitle"
        @close="closeModal"
      >
        <template v-if="selectedForm === 'consulta'">
          <form @submit.prevent="submitForm">
            <label>Nombre completo</label>
            <input type="text" v-model="formData.name" required />
            <label>RUN</label>
            <input type="text" v-model="formData.run" required />
            <label>Domicilio</label>
            <input type="text" v-model="formData.address" required />
            <label>Teléfono</label>
            <input type="tel" v-model="formData.phone" required />
            <label>Correo electrónico</label>
            <input type="email" v-model="formData.email" required />
            <button type="submit">Enviar</button>
          </form>
        </template>
        <template v-else-if="selectedForm === 'denuncia'">
          <form @submit.prevent="submitForm">
            <label>Nombre completo</label>
            <input type="text" v-model="formData.name" required />
            <label>RUN</label>
            <input type="text" v-model="formData.run" required />
            <label>Domicilio</label>
            <input type="text" v-model="formData.address" required />
            <label>Teléfono</label>
            <input type="tel" v-model="formData.phone" required />
            <label>Correo electrónico</label>
            <input type="email" v-model="formData.email" required />
            <label>Breve relato de lo sucedido</label>
            <textarea v-model="formData.description" required></textarea>
            <button type="submit">Enviar</button>
          </form>
        </template>
        <template v-else-if="selectedForm === 'citacion'">
          <form @submit.prevent="submitForm">
            <label>Nombre completo</label>
            <input type="text" v-model="formData.name" required />
            <label>RUN</label>
            <input type="text" v-model="formData.run" required />
            <label>Domicilio</label>
            <input type="text" v-model="formData.address" required />
            <label>Teléfono</label>
            <input type="tel" v-model="formData.phone" required />
            <label>Correo electrónico</label>
            <input type="email" v-model="formData.email" required />
            <label>Funcionario que lo citó</label>
            <input type="text" v-model="formData.officer" required />
            <button type="submit">Enviar</button>
          </form>
        </template>
      </Modal>
    </div>
  </template>
  
  <script>
  import Modal from "../components/Modal.vue";
  
  export default {
    components: { Modal },
    data() {
      return {
        isModalVisible: false,
        modalTitle: "",
        selectedForm: "",
        formData: {
          name: "",
          run: "",
          address: "",
          phone: "",
          email: "",
          description: "",
          officer: "",
        },
      };
    },
    methods: {
      openModal(formType) {
        this.isModalVisible = true;
        this.selectedForm = formType;
  
        if (formType === "consulta") {
          this.modalTitle = "Consulta de Antecedentes";
        } else if (formType === "denuncia") {
          this.modalTitle = "Denuncia";
        } else if (formType === "citacion") {
          this.modalTitle = "Citación";
        }
      },
      closeModal() {
        this.isModalVisible = false;
        this.formData = {
          name: "",
          run: "",
          address: "",
          phone: "",
          email: "",
          description: "",
          officer: "",
        };
      },
      submitForm() {
        console.log("Formulario enviado:", this.formData);
        this.closeModal();
      },
    },
  };
  </script>
  
  <style scoped>
    /* Contenedor principal */
    .main-content {
    text-align: center;
    padding: 2rem;
  }
  
  .main-content h2 {
    margin-bottom: 2rem;
    color: #003366;
    font-size: 1.8rem;
    text-align: center; 
  }

  /* Estilos del formulario */
form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem; 
}

label {
  font-weight: bold;
  color: #003366; 
}

input,
textarea {
  width: 95%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 10px; 
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #003366; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
}

textarea {
  resize: none; 
  height: 100px; 
}

button[type="submit"] {
  background-color: #003366; 
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 10px; 
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s, box-shadow 0.2s;
}

button[type="submit"]:hover {
  background-color: #00509e; 
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); 
}

  

  .cards-container {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
  }
  
  .card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.25);
    width: 280px;
    padding: 1.5rem;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.35);
  }
  
  .card-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
  }
  
  .card h3 {
    margin: 1rem 0 0.5rem;
    color: #003366;
  }
  
  .card p {
    color: #555;
    font-size: 0.9rem;
    margin: 0;
  }
  

  @media (max-width: 768px) {
    .cards-container {
      flex-direction: column;
      align-items: center;
    }
  
    .card {
      width: 90%;
    }
  }

  </style>
  