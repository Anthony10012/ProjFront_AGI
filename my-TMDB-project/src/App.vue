<script setup>
  import { useRouter, useRoute } from 'vue-router';
  import { computed } from 'vue';

  const router = useRouter();
  const route = useRoute();

  // On cache le bouton si on est déjà sur la page d'accueil
  const showBackButton = computed(() => route.path !== '/');

  const goBack = () => {
  router.back();
  };
</script>
<template>
  <div id="app-layout">
    <nav class="global-nav">
      <!-- Bouton Retour (s'affiche seulement si on n'est pas sur la page d'accueil) -->
      <button
          v-if="showBackButton"
          @click="goBack"
          class="global-back-btn"
          title="Page précédente"
      >
        <span class="icon">←</span> Retour
      </button>

      <!-- Ici tu peux mettre d'autres liens de nav -->
      <router-link to="/" class="nav-link">Accueil</router-link>
      <router-link to="/movies" class="nav-link">Films</router-link>
      <router-link to ="/favoris" class="nav-link">Favoris</router-link>
    </nav>

    <router-view />
  </div>
</template>


<style>
/* Nav bar classique */
.global-nav {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 20px;
  background-color: #032541;
  color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* Bouton retour */
.global-back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background-color: #01b4e4;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.global-back-btn:hover {
  background-color: #0282b2;
  transform: scale(1.05);
}

.global-back-btn .icon {
  font-size: 1.2rem;
}

/* Liens de nav */
.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-link:hover {
  background-color: #01b4e4;
}
</style>
