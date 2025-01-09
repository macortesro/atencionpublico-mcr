<template>
    <div class="card">
      <slot />
    </div>
  </template>
  
  <style scoped>
  .card {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .card:hover {
    transform: scale(1.05);
  }
  </style>
  