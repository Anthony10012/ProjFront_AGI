<script setup>
import { ref, onMounted, computed, watch } from "vue";
const apiKey = "d7a3a9b7bf495277a0437c9f4031d048";

const moviesBase = ref([]);   // films discover (par défaut)
const moviesSearch = ref([]); // films recherche
const genres = ref([]); // Liste des genres

const query = ref(""); // Texte de recherche
const selectedGenre = ref(""); // Genre séléctionné pour l'utilisateur
const sortBy = ref("popularity.desc"); // Option de tri selectionnée

// Charger les genres + films par défaut
onMounted(async () => {
  // Recuperation de la liste des genres
  const genreRes = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=fr`
  );
  const genreData = await genreRes.json();
  genres.value = genreData.genres;

  // Chargement des films par défaut
  await loadDiscover();
});

// Chargement des films via "discover"
async function loadDiscover() {
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr&sort_by=${sortBy.value}`;

  // Ajout du filtre par genre si selectionné
  if (selectedGenre.value) {
    url += `&with_genres=${selectedGenre.value}`;
  }

  const res = await fetch(url);
  const data = await res.json();
  moviesBase.value = data.results;
}

//Recherche de film par texte
async function searchMovies() {
  // Si la recherche est vide on réinitialise les résultats
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

// Quand le genre ou le tri change
// → on recharge les films discover uniquement
// → seulement s'il n'y a pas de recherche active
watch([selectedGenre, sortBy], () => {
  if (!query.value) {
    loadDiscover();
  }
});

// Liste finale des films à afficher
const moviesToDisplay = computed(() => {

  // Si une recherche est active → on affiche les résultats de recherche
  // Sinon → on affiche les films par défaut (discover)
  const source = query.value ? moviesSearch.value : moviesBase.value;

  // Copie du tableau pour éviter de modifier l'original
  let list = [...source];

  // Filtre genre (frontend si en mode recherche)
  if (selectedGenre.value && query.value) {
    list = list.filter(movie =>
        movie.genre_ids?.includes(Number(selectedGenre.value))
    );
  }

  // Tri frontend si search
  if (query.value) {
    // on découpe la valeur du tri
    // key = critère de tri, order = sens du tri
    const [key, order] = sortBy.value.split(".");

    list.sort((a, b) => {
      // Valeurs à comparer (sécurité si la valeur est absente)
      const aVal = a[key] || 0;
      const bVal = b[key] || 0;
      // Application du tri selon le sens choisi
      return order === "asc"
          ? aVal - bVal // ordre croissant
          : bVal - aVal; // ordre décroissant
    });
  }

  return list;
});
</script>

<template>
  <div class="movies">
    <h1>Recherche films</h1>

    <div class="filters">
      <input class="search" v-model="query" placeholder="Rechercher..." />

      <select  class="btn2" v-model="selectedGenre">
        <option value="">Tous les genres</option>
        <option v-for="g in genres" :key="g.id" :value="g.id">
          {{ g.name }}
        </option>
      </select>

      <select class="btn2" v-model="sortBy">
        <option value="popularity.desc">Popularité +</option>
        <option value="popularity.asc">Popularité -</option>
        <option value="release_date.desc">Date +</option>
        <option value="release_date.asc">Date -</option>
        <option value="vote_average.desc">Note +</option>
        <option value="vote_average.asc">Note -</option>
      </select>

      <button  class="btn" @click="searchMovies">Rechercher</button>
    </div>

    <div class="grid">
      <div v-for="movie in moviesToDisplay" :key="movie.id" class="movie-card">
        <img v-if="movie.poster_path"
             :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" />
        <h3>{{ movie.title }}</h3>
        <p>{{ movie.release_date }}</p>
        <p>⭐ {{ movie.vote_average }}</p>
      </div>
    </div>
  </div>
</template>




<style scoped>
.movies {
  padding: 20px;

}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
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

.btn2{
  height: 35px;
  padding: 8px 12px;
  margin-top: 5px;
  font-size: 1rem;
  border: none;
  background-color: #032541;
  color: white;
  cursor: pointer;
  white-space: nowrap; /* évite le retour à la ligne */
}

.search{
  width: 350px;
}
</style>