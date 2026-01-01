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
    <Transition name="fade">
      <button
          v-if="showBackButton"
          @click="goBack"
          class="global-back-btn"
          title="Page précédente"
      >
        <span class="icon">←</span> Retour
      </button>
    </Transition>

    <nav>
    </nav>

    <router-view />
  </div>
</template>

<style>
/* Style global pour le bouton */
.global-back-btn {
  position: fixed; /* Fixé à l'écran */
  bottom: 30px;    /* En bas */
  left: 30px;      /* À gauche */
  z-index: 1000;   /* Par-dessus tout */

  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;

  background-color: #032541;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.global-back-btn:hover {
  background-color: #01b4e4;
  transform: scale(1.05);
}

.global-back-btn .icon {
  font-size: 1.2rem;
}

/* Animation pour l'apparition/disparition du bouton */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>