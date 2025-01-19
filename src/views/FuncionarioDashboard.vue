<template>
  <div class="dashboard-wrapper">
    <aside class="sidebar">
      <h2>Dashboard</h2>
      <ul>
        <li :class="{ active: selectedCategory === 'consultas' }" @click="selectCategory('consultas')">
          Consultas
        </li>
        <li :class="{ active: selectedCategory === 'citaciones' }" @click="selectCategory('citaciones')">
          Citaciones
        </li>
        <li :class="{ active: selectedCategory === 'denuncias' }" @click="selectCategory('denuncias')">
          Denuncias
        </li>
      </ul>

      <!-- Fecha -->
      <div class="date-picker">
        <label for="date">Seleccionar Fecha:</label>
        <input type="date" id="date" v-model="selectedDate" @change="filterByDate" />
      </div>
    </aside>

    <main class="main-content">
      <div class="stats">
        <div class="stat-card">
          <h3>{{ selectedCategoryLabel }} Pendientes</h3>
          <p>{{ stats.pendientes }}</p>
        </div>
        <div class="stat-card">
          <h3>{{ selectedCategoryLabel }} Resueltas</h3>
          <p>{{ stats.resueltos }}</p>
        </div>
        <div class="stat-card">
          <h3>Total de {{ selectedCategoryLabel }}</h3>
          <p>{{ stats.total }}</p>
        </div>
      </div>

      <div class="tramites-list">
  <h2>Listado de {{ selectedCategoryLabel }}</h2>
  <table>
    <thead>
      <tr>
        <th>N° Atención</th>
        <th>Solicitante</th>
        <th>RUN / DNI</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="tramite in tramitesFiltrados" :key="tramite._id">
        <td>{{ tramite.numero_tramite }}</td>
        <td>{{ tramite.nombre }}</td>
        <td>{{ tramite.run }}</td>
        <td>
          <button
            class="estado-btn"
            :class="{ pendiente: !tramite.estado, resuelto: tramite.estado }"
            @click="toggleEstado(tramite)"
          >
            {{ tramite.estado ? "Resuelto" : "Pendiente" }}
          </button>
        </td>
        <td>
          <button class="info-btn" @click="openModal(tramite)">Ver Info</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

    </main>

     <!-- Modal para mostrar información de lo que se ingresó en los formularios -->
    <div v-if="isModalVisible" class="modal-overlay">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">X</button>
        <h3>Información del Trámite</h3>
        <div class="info">
          <p><strong>Nombre:</strong> {{ selectedTramite.nombre }}</p>
          <p><strong>RUN:</strong> {{ selectedTramite.run }}</p>
          <p><strong>Correo:</strong> {{ selectedTramite.correo }}</p>
          <p><strong>Domicilio:</strong> {{ selectedTramite.domicilio }}</p>
          <p><strong>Teléfono:</strong> {{ selectedTramite.telefono }}</p>
          <p><strong>Detalle:</strong> {{ selectedTramite.detalle || "Sin relato proporcionado" }}</p>
          <p><strong>Funcionario Citador:</strong> {{ selectedTramite.funcionario_citador || "No especificado" }}</p>
          <p><strong>Estado:</strong> {{ selectedTramite.estado ? "Resuelto" : "Pendiente" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api/axios";
import { inject } from "vue";

export default {
  setup() {
    const socket = inject("socket"); // Inyectar SocketIO
    return { socket };
  },
  data() {
    return {
      tramites: [],
      selectedCategory: "consultas",
      selectedDate: new Date().toISOString().split("T")[0], // Fecha inicial (hoy)
      stats: {
        pendientes: 0,
        resueltos: 0,
        total: 0,
      },
      isModalVisible: false,
      selectedTramite: {},
    };
  },
  computed: {
    selectedCategoryLabel() {
      const labels = {
        consultas: "Consultas",
        citaciones: "Citaciones",
        denuncias: "Denuncias",
      };
      return labels[this.selectedCategory];
    },
    tramitesFiltrados() {
      const categoriaMap = {
        consultas: "Consulta",
        citaciones: "Citación",
        denuncias: "Denuncia",
      };

      const categoriaSeleccionada = categoriaMap[this.selectedCategory];
      if (!categoriaSeleccionada) return [];

      return this.tramites.filter(
        (tramite) =>
          tramite.tipo_tramite === categoriaSeleccionada &&
          new Date(tramite.fecha_creacion).toISOString().split("T")[0] === this.selectedDate
      );
    },
  },
  methods: {
    async fetchTramites() {
      try {
        const response = await api.get("/tramites");
        this.tramites = response.data.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
        this.updateStats();
      } catch (error) {
        console.error("Error al cargar los trámites:", error);
      }
    },
    updateStats() {
      const currentTramites = this.tramitesFiltrados;
      this.stats.pendientes = currentTramites.filter((tramite) => !tramite.estado).length;
      this.stats.resueltos = currentTramites.filter((tramite) => tramite.estado).length;
      this.stats.total = currentTramites.length;
    },
    selectCategory(category) {
      this.selectedCategory = category;
      this.updateStats();
    },
    filterByDate() {
      console.log("Filtrando trámites por fecha:", this.selectedDate);
      this.updateStats();
    },
    async toggleEstado(tramite) {
      try {
        tramite.estado = !tramite.estado;
        const response = await api.put(`/tramites/${tramite._id}`, { estado: tramite.estado });
        this.updateStats();
      } catch (error) {
        console.error("Error al actualizar el estado:", error);
        alert("No se pudo actualizar el estado del trámite.");
      }
    },
    async deleteTramite(id) {
      try {
        const response = await api.delete(`/tramites/${id}`);
        this.fetchTramites();
      } catch (error) {
        console.error("Error al eliminar el trámite:", error);
        alert("No se pudo eliminar el trámite.");
      }
    },
    openModal(tramite) {
      this.selectedTramite = tramite;
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.selectedTramite = {};
    },
  },
  async created() {
    await this.fetchTramites();

    // Escuchar eventos de SocketIO
    this.socket.on("nuevo-tramite", (tramite) => {
      console.log("Nuevo trámite recibido:", tramite);
      this.tramites.unshift(tramite); // Agregar al inicio
      this.updateStats();
    });

    this.socket.on("actualizar-tramite", (tramiteActualizado) => {
      console.log("Trámite actualizado recibido:", tramiteActualizado);
      const index = this.tramites.findIndex((t) => t._id === tramiteActualizado._id);
      if (index !== -1) {
        this.tramites[index] = tramiteActualizado;
        this.updateStats();
      }
    });

    this.socket.on("eliminar-tramite", (id) => {
      console.log("Trámite eliminado recibido, ID:", id);
      this.tramites = this.tramites.filter((t) => t._id !== id);
      this.updateStats();
    });
  },
};
</script>


<style scoped>
.dashboard-wrapper {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  background-color: #003366;
  color: white;
  width: 250px;
  padding: 20px;
}

.date-picker {
  margin-top: 20px;
  color: white;
}

.date-picker label {
  display: block;
  margin-bottom: 5px;
  color: #f2f5fa;
}

.date-picker input {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: none;
}

.sidebar h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.sidebar li:hover,
.sidebar li.active {
  background-color: #00509e;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f2f5fa;
}

.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.tramites-list {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 98%; 
}

table {
  width: 98%; 
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 10px;
  border: 1px solid #ddd; 
}

th {
  background-color: #f8f9fa; 
  color: #333;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9; 
}


.status-pendiente {
  color: #dc3545;
}

.status-resuelto {
  color: #28a745;
}

.estado-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  color: white;
  transition: background-color 0.3s;
}

.estado-btn.pendiente {
  background-color: #dc3545;
}

.estado-btn.resuelto {
  background-color: #28a745;
}

.estado-btn:hover {
  opacity: 0.9;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1001;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.info-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: #007bff;
  font-weight: bold;
  cursor: pointer;
}

.info-btn:hover {
  background-color: #0056b3;
}
</style>
