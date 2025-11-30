<script setup>
import SearchForm from '@/components/SearchForm.vue';
import MovieResult from '@/components/MovieResult.vue';
import { useSearchStore } from '@/stores/search';
import { storeToRefs } from 'pinia';

const searchStore = useSearchStore();

// Utiliser storeToRefs pour que les propriétés d'état restent réactives
const { results, isLoading, error, query } = storeToRefs(searchStore);
</script>

<template>
  <main class="search-page">
    <h2>Recherche de Films TMDBs</h2>

    <SearchForm />

    <div v-if="isLoading" class="status-message">
      Chargement des résultats pour "{{ query }}"...         </div>

    <div v-else-if="error" class="error-message">
      ❌ Erreur: {{ error }}
    </div>

    <div v-else-if="results.length > 0" class="results-list">
      <h3>Résultats de recherche pour "{{ query }}" ({{ results.length }} trouvés)</h3>
      <MovieResult
          v-for="movie in results"
          :key="movie.id"
          :movie="movie"
      />
    </div>

    <div v-else-if="query && !isLoading" class="status-message no-results">
      Aucun résultat trouvé pour "{{ query }}".
    </div>
    <div v-else class="status-message initial-message">
      Veuillez entrer un terme de recherche pour commencer.
    </div>
  </main>
</template>

<style scoped>
.search-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;

}
h2, h3 {
  color: #032541;
}
.status-message {
  padding: 20px;
  border-radius: 4px;
  margin-top: 20px;
  text-align: center;
}
.error-message {
  background-color: #fdd;
  color: #c00;
  border: 1px solid #c00;
}
.no-results {
  background-color: #f0f0f0;
  color: #555;
}
.initial-message {
  color: #888;
}
.results-list {
  margin-top: 20px;
}
</style>