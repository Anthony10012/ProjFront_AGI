<template>
  <div class="home">
    <h1>Films</h1>

    <!-- Composant de recherche -->
    <SearchForm />

    <!-- Résultats -->
    <div class="grid">
      <div
          v-for="movie in displayedMovies"
          :key="movie.id"
          class="movie-card"
      >
        <img
            v-if="movie.poster_path"
            :src="'https://image.tmdb.org/t/p/w200' + movie.poster_path"
            alt=""
        />
        <h3>{{ movie.title }}</h3>
        <p>{{ movie.release_date }}</p>
        <p>⭐ {{ movie.vote_average }}</p>
      </div>
    </div>

    <!-- Bouton vers la page avancée -->
    <router-link to="/movies">
      <button class="btn">Filtres & Tri avancés</button>
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSearchStore } from '@/stores/search';
import SearchForm from '@/components/SearchForm.vue';

const searchStore = useSearchStore();
const moviesPopular = ref([]);

// Charger films populaires au montage
onMounted(async () => {
  const apiKey = 'd7a3a9b7bf495277a0437c9f4031d048';
  const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr&sort_by=popularity.desc&page=1`
  );
  const data = await res.json();
  moviesPopular.value = data.results.slice(0, 6);
});

// Computed : afficher soit les résultats de recherche, soit les films populaires
const displayedMovies = computed(() => {
  return searchStore.searchResults.length > 0
      ? searchStore.searchResults
      : moviesPopular.value;
});
</script>

<style scoped>
.home {
  padding: 20px;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.movie-card {
  width: 150px;
}

.movie-card img {
  width: 100%;
  border-radius: 8px;
}

.btn {
  margin-top: 20px;
  padding: 10px 20px;
  cursor: pointer;
}
</style>
