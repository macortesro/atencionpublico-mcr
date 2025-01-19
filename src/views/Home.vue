<template>
  <div class="home">
    <div v-if="isConfirmationVisible">
      <div class="confirmation">
        <img src="/src/assets/listo.png" alt="Confirmación" class="confirmation-icon" />
        <p>
          Trámite ingresado correctamente. El número asignado corresponde a <strong>{{ numeroTramite }}</strong>.
          Guarde este número para su atención.
        </p>
        <button @click="resetToHome">Aceptar</button>
        <p class="redirect-message">Serás redirigido a la página de inicio en 15 segundos...</p>
      </div>
    </div>
    <div v-else>
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

      <Modal :isVisible="isModalVisible" :title="modalTitle" @close="closeModal">
        <template v-if="selectedForm === 'consulta'">
          <form @submit.prevent="submitForm">
            <label>Nombre completo</label>
            <input type="text" v-model="formData.nombre" required />
            <label>RUN / DNI</label>
            <input type="text" v-model="formData.run" required />
            <label>Domicilio</label>
            <input type="text" v-model="formData.domicilio" required />
            <label>Teléfono</label>
            <input type="tel" v-model="formData.telefono" required />
            <label>Correo electrónico</label>
            <input type="email" v-model="formData.correo" required />
            <button type="submit">Enviar</button>
          </form>
        </template>
        <template v-else-if="selectedForm === 'denuncia'">
          <form @submit.prevent="submitForm">
            <label>Nombre completo</label>
            <input type="text" v-model="formData.nombre" required />
            <label>RUN / DNI</label>
            <input type="text" v-model="formData.run" required />
            <label>Domicilio</label>
            <input type="text" v-model="formData.domicilio" required />
            <label>Teléfono</label>
            <input type="tel" v-model="formData.telefono" required />
            <label>Correo electrónico</label>
            <input type="email" v-model="formData.correo" required />
            <label>Breve relato de lo sucedido</label>
            <textarea v-model="formData.description" required></textarea>
            <button type="submit">Enviar</button>
          </form>
        </template>
        <template v-else-if="selectedForm === 'citacion'">
          <form @submit.prevent="submitForm">
            <label>Nombre completo</label>
            <input type="text" v-model="formData.nombre" required />
            <label>RUN / DNI</label>
            <input type="text" v-model="formData.run" required />
            <label>Domicilio</label>
            <input type="text" v-model="formData.domicilio" required />
            <label>Teléfono</label>
            <input type="tel" v-model="formData.telefono" required />
            <label>Correo electrónico</label>
            <input type="email" v-model="formData.correo" required />
            <label>Funcionario que lo citó</label>
            <input type="text" v-model="formData.officer" required />
            <button type="submit">Enviar</button>
          </form>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script>
import Modal from "../components/Modal.vue";
import api from "../api/axios";

export default {
  components: { Modal },
  data() {
    return {
      isModalVisible: false,
      isConfirmationVisible: false,
      modalTitle: "",
      selectedForm: "",
      numeroTramite: "",
      formData: {
        tipo_tramite: "",
        nombre: "",
        run: "",
        domicilio: "",
        telefono: "",
        correo: "",
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
        this.formData.tipo_tramite = "Consulta";
      } else if (formType === "denuncia") {
        this.modalTitle = "Denuncia";
        this.formData.tipo_tramite = "Denuncia";
      } else if (formType === "citacion") {
        this.modalTitle = "Citación";
        this.formData.tipo_tramite = "Citación";
      }
    },
    closeModal() {
      this.isModalVisible = false;
      this.resetFormData();
    },
    resetFormData() {
      this.formData = {
        tipo_tramite: "",
        nombre: "",
        run: "",
        domicilio: "",
        telefono: "",
        correo: "",
        description: "",
        officer: "",
      };
    },
    resetToHome() {
      this.isConfirmationVisible = false;
    },
    async submitForm() {
      try {
        const response = await api.post("/tramites", {
      tipo_tramite: this.formData.tipo_tramite,
      nombre: this.formData.nombre,
      run: this.formData.run,
      correo: this.formData.correo,
      domicilio: this.formData.domicilio,
      telefono: this.formData.telefono,
      detalle: this.formData.tipo_tramite === "Denuncia" ? this.formData.description : null,
      funcionario_citador: this.formData.tipo_tramite === "Citación" ? this.formData.officer : null,
    });
        this.numeroTramite = response.data.numero_tramite;
        this.isModalVisible = false;
        this.isConfirmationVisible = true;

        // Redirige automáticamente a la página de inicio después de 15 segundos
        setTimeout(() => {
          this.resetToHome();
        }, 15000);
      } catch (error) {
        console.error("Error al enviar el trámite:", error);

        if (error.response && error.response.data && error.response.data.message) {
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert("Ocurrió un error al enviar el trámite.");
        }
      }
    },
  },
};
</script>

  
  <style scoped>

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

  .confirmation {
  text-align: center;
  margin-top: 50px;
}

.confirmation-icon {
  width: 100px;
  margin-bottom: 20px;
}

.confirmation p {
  font-size: 1.8rem;
  color: #003366;
  margin-bottom: 50px;
}

.confirmation button {
  background-color: #003366;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
}

.confirmation .redirect-message {
  font-size: 0.9rem;
  color: #777;
  margin-top: 10px;
}

  </style>
  