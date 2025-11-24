<script setup>
import { ref } from 'vue';
import { useSearchStore } from '@/stores/search';

const searchStore = useSearchStore();
const searchQuery = ref('');

const submitSearch = () => {
  // Appelle l'action du store Pinia
  searchStore.searchMovies(searchQuery.value);
};
</script>

<template>
  <form @submit.prevent="submitSearch" class="search-form">
    <input
        type="text"
        v-model="searchQuery"
        placeholder="Rechercher un film..."
        aria-label="Champ de recherche de film"
    />
    <button type="submit" :disabled="searchStore.isLoading">
      Rechercher
    </button>
  </form>
</template>

<style scoped>
.search-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
input {
  padding: 10px;
  flex-grow: 1;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 10px 15px;
  background-color: #032541; /* Couleur TMDB */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background-color: #6c7a89;
  cursor: not-allowed;
}
</style>