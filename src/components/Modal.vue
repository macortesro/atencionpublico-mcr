<template>
    <div class="modal-overlay" v-if="isVisible">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">X</button>
        <h3>{{ title }}</h3>
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: {
        type: Boolean,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
    methods: {
      closeModal() {
        this.$emit("close");
      },
    },
  };
  </script>
  
  <style scoped>
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
    padding: 2rem;
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
  </style>
  