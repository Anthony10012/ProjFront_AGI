<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import FavoritToggle from "@/components/FavoritToggle.vue";

const route = useRoute();
const movieId = route.params.id;

const movie = ref(null);
const loading = ref(true);
const error = ref(null);

const apiKey = "d7a3a9b7bf495277a0437c9f4031d048";

onMounted(async () => {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=fr-FR`);
    const data = await res.json();
    movie.value = data;
  } catch (e) {
    error.value = "Impossible de charger le film.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main class="movie-details" :style="{ '--poster-url': movie?.poster_path ? `url('https://image.tmdb.org/t/p/w500${movie.poster_path}')` : 'none' }">
    <div v-if="loading">Chargement…</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="movie-container">
      <FavoritToggle
          class="favorite-toggle"
          :movieId="movie.id"
      />


      <!-- Poster net à gauche -->
      <img
          v-if="movie?.poster_path"
          :src="'https://image.tmdb.org/t/p/w400' + movie.poster_path"
          :alt="movie?.title"
          class="movie-poster"
      />

      <!-- Infos du film -->
      <div class="movie-info">
        <h1>{{ movie?.title }}</h1>
        <p class="release-date">Sortie: {{ movie?.release_date || 'N/A' }}</p>
        <p class="overview">{{ movie?.overview }}</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.movie-details {
  position: relative;
  padding: 20px;
  overflow: hidden;
}

/* Fond du poster à droite, transparent et derrière tout */
.movie-details::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;              /* largeur du fond */
  height: 100%;
  background-image: var(--poster-url);
  background-size: 100% auto;   /* largeur complète, hauteur proportionnelle */
  background-position: right top; /* alignée à droite et en haut */
  background-repeat: no-repeat;
  opacity: 0.2;
  z-index: -1;
  pointer-events: none;
}

.movie-container {
  display: flex;
  gap: clamp(20px, 8vw, 80px);
  align-items: flex-start;
  position: relative;
  z-index: 1;
  padding-top: 40px; /* espace pour le cœur */
}

.favorite-toggle {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.movie-poster {
  width: 400px;
  height: auto;
  border-radius: 8px;
  flex-shrink: 0;
}

.movie-info {
  max-width: 100%;
  text-align: right; /* texte aligné à droite */
  margin-left: auto;
}

h1 {
  margin-top: 0;
  font-size: 2.5em;
}

.release-date {
  font-size: 1em;
  color: black;
  margin-bottom: 10px;
  font-weight: bold;
}

.overview {
  font-size: clamp(1em, 2vw, 2em);
  line-height: 1.5;
  font-weight: bold;
  border-radius: 10px;
  height: 500px;
  width: 100%;
  max-width: 600px;

  overflow-y: auto;     /* <=== SCROLL VERTICAL !!! */
  overflow-x: hidden;   /* évite le débordement horizontal */
  padding-right: 10px;  /* évite que le texte colle au bord */
  box-sizing: border-box;

}

.favorite-toggle {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}
</style>
