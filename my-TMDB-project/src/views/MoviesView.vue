<script setup>
import { ref, onMounted, computed, watch } from "vue";
import MovieResult from "@/components/MovieResult.vue"; // Importation cruciale

const apiKey = "d7a3a9b7bf495277a0437c9f4031d048";

const moviesBase = ref([]);
const moviesSearch = ref([]);
const genres = ref([]);

const query = ref("");
const selectedGenre = ref("");
const sortBy = ref("popularity.desc");

// Charger les genres + films par défaut
onMounted(async () => {
  const genreRes = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=fr`
  );
  const genreData = await genreRes.json();
  genres.value = genreData.genres;

  await loadDiscover();
});

async function loadDiscover() {
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr&sort_by=${sortBy.value}`;

  if (selectedGenre.value) {
    url += `&with_genres=${selectedGenre.value}`;
  }

  const res = await fetch(url);
  const data = await res.json();
  moviesBase.value = data.results;
}

async function searchMovies() {
  if (!query.value) {
    moviesSearch.value = [];
    return;
  }

  const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fr&query=${encodeURIComponent(
          query.value
      )}`
  );
  const data = await res.json();
  moviesSearch.value = data.results;
}

// Recharger si le genre ou le tri change (uniquement hors mode recherche textuelle)
watch([selectedGenre, sortBy], () => {
  if (!query.value) {
    loadDiscover();
  }
});

const moviesToDisplay = computed(() => {
  const source = query.value ? moviesSearch.value : moviesBase.value;
  let list = [...source];

  // Filtre genre si on est en mode recherche textuelle (car l'API search ne filtre pas par genre nativement facilement)
  if (selectedGenre.value && query.value) {
    list = list.filter(movie =>
        movie.genre_ids?.includes(Number(selectedGenre.value))
    );
  }

  // Tri manuel si on est en mode recherche
  if (query.value) {
    const [key, order] = sortBy.value.split(".");
    list.sort((a, b) => {
      const aVal = a[key] || 0;
      const bVal = b[key] || 0;
      return order === "asc" ? aVal - bVal : bVal - aVal;
    });
  }

  return list;
});
</script>

<template>
  <div class="movies-container">
    <h1>Explorer les films</h1>

    <div class="filters-bar">
      <input
          class="search-input"
          v-model="query"
          placeholder="Rechercher par titre..."
          @keyup.enter="searchMovies"
      />

      <select class="select-style" v-model="selectedGenre">
        <option value="">Tous les genres</option>
        <option v-for="g in genres" :key="g.id" :value="g.id">
          {{ g.name }}
        </option>
      </select>

      <select class="select-style" v-model="sortBy">
        <option value="popularity.desc">Popularité (Décroissant)</option>
        <option value="popularity.asc">Popularité (Croissant)</option>
        <option value="release_date.desc">Date (Récent)</option>
        <option value="release_date.asc">Date (Ancien)</option>
        <option value="vote_average.desc">Note (Meilleure)</option>
        <option value="vote_average.asc">Note (Pire)</option>
      </select>

      <button class="btn-search" @click="searchMovies">Rechercher</button>
    </div>

    <div class="movies-grid">
      <MovieResult
          v-for="movie in moviesToDisplay"
          :key="movie.id"
          :movie="movie"
      />
    </div>

    <div v-if="moviesToDisplay.length === 0" class="no-results">
      Aucun film ne correspond à vos critères.
    </div>
  </div>
</template>

<style scoped>
.movies-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
  background: #f4f4f4;
  padding: 20px;
  border-radius: 12px;
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.select-style {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}

.btn-search {
  padding: 10px 25px;
  border-radius: 8px;
  border: none;
  background-color: #032541;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-search:hover {
  background-color: #01b4e4;
}

/* Grille flexible pour MovieResult */
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.no-results {
  text-align: center;
  margin-top: 50px;
  font-size: 1.2rem;
  color: #666;
}
</style>