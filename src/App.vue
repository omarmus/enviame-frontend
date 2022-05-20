<template>
  <header>
    <div class="navbar navbar-dark bg-dark shadow-sm">
      <div class="container">
        <a href="#" class="navbar-brand d-flex align-items-center">
          <IconMarvel />
        </a>
      </div>
    </div>
  </header>
  <main>
    <router-view/>
  </main>
  <footer class="text-muted py-5">
    <div class="container">
      <p class="float-end mb-1">
        <a href="#">Regresar arriba</a>
      </p>
      <p class="mb-1">Lista de personajes de MARVEL hecho por &copy; omarmus.com</p>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import IconMarvel from './components/icons/IconMarvel.vue'
</script>

<style lang="scss" src="./assets/scss/main.scss"></style>
