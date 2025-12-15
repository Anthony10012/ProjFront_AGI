<template>
  <div class="home">
    <h1>Films</h1>

    <!-- Barre de recherche -->
    <div class="search">
      <input class="sb" v-model="query" placeholder="Rechercher un film..." />
      <button  class="btn" @click="searchMovies">Rechercher</button>
      <!-- Bouton vers la page avancée -->
      <router-link to="/movies">
        <button class="btn">Filtres & Tri avancés</button>
      </router-link>

    </div>


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


  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const apiKey = "d7a3a9b7bf495277a0437c9f4031d048";

const query = ref("");
const moviesPopular = ref([]);
const searchResults = ref([]); // <- garder pour les résultats de recherche

// Charger les films populaires au montage
onMounted(async () => {
  const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr&sort_by=popularity.desc&page=1`
  );
  const data = await res.json();
  moviesPopular.value = data.results.slice(0,18); // seulement quelques films
});

// Recherche de films
async function searchMovies() {
  if (!query.value) {
    searchResults.value = [];
    return;
  }

  const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fr&query=${encodeURIComponent(
          query.value
      )}`
  );
  const data = await res.json();
  searchResults.value = data.results;
}

// Computed : choisir quoi afficher
const displayedMovies = computed(() => {
  // Si searchResults a des films, on affiche ceux-là
  return searchResults.value.length > 0 ? searchResults.value : moviesPopular.value;
});
</script>

<style scoped>
.home {
  padding: 20px;
}

.search {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;


}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.sb{
    flex: 0.25;
    padding: 10px;
    font-size: 1rem;


}
.movie-card {
  width: 180px;
}

.movie-card img {
  width: 100%;
  border-radius: 8px;
}

.btn {
  padding: 14px 18px;
  font-size: 1rem;
  border-radius: 30px;
  border: none;
  background-color: #032541;
  color: white;
  cursor: pointer;
  white-space: nowrap; /* évite le retour à la ligne */

}
</style>
