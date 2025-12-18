<template>
  <div class="home">
    <h1>Films Populaires</h1>

    <div class="search-section">
      <input
          class="search-bar"
          v-model="query"
          placeholder="Rechercher un film..."
          @keyup.enter="searchMovies"
      />
      <button class="btn-main" @click="searchMovies">Rechercher</button>

      <router-link to="/movies">
        <button class="btn-secondary">Filtres & Tri avancés</button>
      </router-link>
    </div>

    <div class="movies-grid">
      <MovieResult
          v-for="movie in displayedMovies"
          :key="movie.id"
          :movie="movie"
      />
    </div>

    <div v-if="displayedMovies.length === 0" class="no-results">
      Aucun film trouvé pour "{{ query }}".
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import MovieResult from "@/components/MovieResult.vue"; // On importe le composant commun

const apiKey = "d7a3a9b7bf495277a0437c9f4031d048";

const query = ref("");
const moviesPopular = ref([]);
const searchResults = ref([]);

// Charger les films populaires au montage
onMounted(async () => {
  try {
    const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr&sort_by=popularity.desc&page=1`
    );
    const data = await res.json();
    // On affiche les 12 premiers films populaires par défaut
    moviesPopular.value = data.results.slice(0, 12);
  } catch (error) {
    console.error("Erreur lors du chargement des films :", error);
  }
});

// Recherche de films
async function searchMovies() {
  if (!query.value.trim()) {
    searchResults.value = [];
    return;
  }

  try {
    const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fr&query=${encodeURIComponent(
            query.value
        )}`
    );
    const data = await res.json();
    searchResults.value = data.results;
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
  }
}

// Choix de la source de données
const displayedMovies = computed(() => {
  return searchResults.value.length > 0 ? searchResults.value : moviesPopular.value;
});
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
  align-items: center;
}

.search-bar {
  flex: 1;
  min-width: 250px;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

/* Grille alignée sur MovieResult */
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.btn-main {
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 30px;
  border: none;
  background-color: #032541;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-main:hover {
  background-color: #01b4e4;
}

.btn-secondary {
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 30px;
  border: 1px solid #032541;
  background-color: transparent;
  color: #032541;
  cursor: pointer;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
}

/* Ajustement pour mobile */
@media (max-width: 600px) {
  .movies-grid {
    grid-template-columns: 1fr;
  }
}
</style>