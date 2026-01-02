<template>
  <div class="home">
    <h1>Films Populaires</h1>

    <div class="search-section">
      <input
          class="search-bar"
          v-model="query"
          placeholder="Rechercher un film..."
          @keyup.enter="goToFirstPage"
      />
      <button class="btn-main" @click="goToFirstPage">Rechercher</button>

      <router-link to="/movies">
        <button class="btn-secondary">Filtres & Tri avancés</button>
      </router-link>
    </div>

    <div v-if="isLoading" class="loading">Chargement…</div>

    <div class="movies-grid">
      <MovieResult
          v-for="movie in displayedMovies"
          :key="movie.id"
          :movie="movie"
      />
    </div>

    <div v-if="displayedMovies.length === 0 && !isLoading" class="no-results">
      Aucun film trouvé pour "{{ query }}".
    </div>

    <!-- Pagination uniquement pour la recherche -->
    <div v-if="isSearching && totalPages > 1" class="pagination">
      <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">◀</button>
      <span>Page {{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">▶</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import MovieResult from "@/components/MovieResult.vue";

const apiKey = "d7a3a9b7bf495277a0437c9f4031d048";

const route = useRoute();
const router = useRouter();

const query = ref(route.query.q || "");
const currentPage = ref(Number(route.query.page) || 1);

const moviesPopular = ref([]);
const searchResults = ref([]);
const totalPages = ref(1);
const isSearching = ref(false);
const isLoading = ref(false);

// Affiche les films populaires par défaut
onMounted(async () => {
  if (!query.value) {
    try {
      const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr&sort_by=popularity.desc&page=1`
      );
      const data = await res.json();
      moviesPopular.value = data.results.slice(0, 12);
    } catch (error) {
      console.error("Erreur lors du chargement des films :", error);
    }
  } else {
    // Si query param présent, lancer la recherche
    searchMovies();
  }
});

// Fonction pour lancer la recherche depuis la page 1
function goToFirstPage() {
  currentPage.value = 1;
  updateRouteQuery();
  searchMovies();
}

// Fonction pour changer de page
function goToPage(page) {
  currentPage.value = page;
  updateRouteQuery();
  searchMovies();
}

// Mettre à jour les query params dans l'URL
function updateRouteQuery() {
  router.replace({ query: { q: query.value || undefined, page: currentPage.value } });
}

// Recherche avec pagination
async function searchMovies() {
  if (!query.value.trim()) {
    searchResults.value = [];
    isSearching.value = false;
    totalPages.value = 1;
    return;
  }

  isSearching.value = true;
  isLoading.value = true;

  try {
    const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fr&query=${encodeURIComponent(
            query.value
        )}&page=${currentPage.value}`
    );
    const data = await res.json();
    searchResults.value = data.results;
    totalPages.value = data.total_pages;
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
  } finally {
    isLoading.value = false;
  }
}

// Déclenche recherche automatiquement si query ou page change via query param
watch([() => route.query.q, () => route.query.page], ([newQuery, newPage]) => {
  if (newQuery !== undefined) query.value = newQuery;
  if (newPage !== undefined) currentPage.value = Number(newPage);
  if (query.value) searchMovies();
});

// Films à afficher
const displayedMovies = computed(() => {
  return isSearching.value ? searchResults.value : moviesPopular.value;
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
  order: -1;
  flex: 1;
  min-width: 250px;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

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
  background-color: #032541;
  color: white;
  cursor: pointer;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  margin: 20px 0;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
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

@media (max-width: 600px) {
  .movies-grid {
    grid-template-columns: 1fr;
  }
}
</style>
