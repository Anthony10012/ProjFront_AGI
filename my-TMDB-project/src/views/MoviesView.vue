<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import MovieResult from "@/components/MovieResult.vue";

const apiKey = "d7a3a9b7bf495277a0437c9f4031d048";

const route = useRoute();
const router = useRouter();

const movies = ref([]);
const genres = ref([]);

// Lecture initiale depuis l'URL pour restaurer état
const query = ref(route.query.q || "");
const selectedGenre = ref(route.query.genre || "");
const sortBy = ref(route.query.sort || "popularity.desc");
const currentPage = ref(Number(route.query.page) || 1);
const totalPages = ref(1);

const isLoading = ref(false);

/* Chargement des genres et des films */
onMounted(async () => {
  const genreRes = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=fr`
  );
  const genreData = await genreRes.json();
  genres.value = genreData.genres;

  loadMovies();
});

/* Chargement centralisé */
async function loadMovies() {
  isLoading.value = true;

  let url = "";
  if (query.value) {
    url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fr&query=${encodeURIComponent(
        query.value
    )}&page=${currentPage.value}`;
  } else {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr&sort_by=${sortBy.value}&page=${currentPage.value}`;
    if (selectedGenre.value) url += `&with_genres=${selectedGenre.value}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    movies.value = data.results;
    totalPages.value = data.total_pages;
  } catch (e) {
    console.error("Erreur chargement films", e);
  } finally {
    isLoading.value = false;
  }

  updateRouteQuery();
}

/* Mettre à jour les query params pour la mémoire */
function updateRouteQuery() {
  router.replace({
    query: {
      q: query.value || undefined,
      genre: selectedGenre.value || undefined,
      sort: sortBy.value || undefined,
      page: currentPage.value
    }
  });
}

/* Watchers pour reload */
watch([query, selectedGenre, sortBy], () => {
  currentPage.value = 1;
  loadMovies();
});

watch(currentPage, () => {
  loadMovies();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* Watch sur route pour restaurer l’état si on revient */
watch(
    () => route.query,
    (newQuery) => {
      query.value = newQuery.q || "";
      selectedGenre.value = newQuery.genre || "";
      sortBy.value = newQuery.sort || "popularity.desc";
      currentPage.value = Number(newQuery.page) || 1;
      loadMovies();
    }
);
</script>

<template>
  <div class="movies-container">
    <h1>Explorer les films</h1>

    <div class="filters-bar">
      <input class="search-input" v-model="query" placeholder="Rechercher par titre..." />

      <select class="select-style" v-model="selectedGenre">
        <option value="">Tous les genres</option>
        <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.name }}</option>
      </select>

      <select class="select-style" v-model="sortBy">
        <option value="popularity.desc">Popularité (Décroissant)</option>
        <option value="popularity.asc">Popularité (Croissant)</option>
        <option value="release_date.desc">Date (Récent)</option>
        <option value="release_date.asc">Date (Ancien)</option>
        <option value="vote_average.desc">Note (Meilleure)</option>
        <option value="vote_average.asc">Note (Pire)</option>
      </select>
    </div>

    <div v-if="isLoading" class="loading">Chargement…</div>

    <div class="movies-grid">
      <MovieResult v-for="movie in movies" :key="movie.id" :movie="movie" />
    </div>

    <div v-if="movies.length === 0 && !isLoading" class="no-results">
      Aucun film ne correspond à vos critères.
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">◀</button>
      <span>Page {{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">▶</button>
    </div>
  </div>
</template>

<style scoped>
.loading {
  text-align: center;
  font-size: 1.2rem;
  margin: 30px 0;
}
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

.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.pagination button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background: #032541;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
