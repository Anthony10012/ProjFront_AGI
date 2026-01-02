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

const placeholderPoster = '/assets/placeholder-movie.png'; // Crée ou utilise cette image pour "pas d'image disponible"

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
  <div id="title"><h1>{{ movie?.title }}</h1></div>
  <main class="movie-details" :style="{ '--poster-url': movie?.poster_path ? `url('https://image.tmdb.org/t/p/w500${movie.poster_path}')` : 'none' }">
    <div v-if="loading">Chargement…</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else class="movie-container">

      <div id="poster">
        <FavoritToggle
          class="favorite-toggle"
          :movieId="movie.id"
      />
        <!-- Poster -->
        <img
            :src="movie?.poster_path ? 'https://image.tmdb.org/t/p/w400' + movie.poster_path : placeholderPoster"
            :alt="movie?.poster_path ? movie?.title : 'Pas d\'image disponible'"
            class="movie-poster"
        />
      </div>
      <!-- Infos -->
      <div class="movie-info">
        <p class="release-date">Sortie: {{ movie?.release_date || 'N/A' }}</p>
        <p class="overview">{{ movie?.overview || 'Pas de description disponible.' }}</p>
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

/* Fond poster derrière, seulement si poster existe */
.movie-details::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background-image: var(--poster-url);
  background-size: 100% auto;
  background-position: right top;
  background-repeat: no-repeat;
  opacity: 0.2;
  z-index: -1;
  pointer-events: none;
}

/* Responsivité */

/* Mobile first */
@media (max-width: 768px){
/* Container flex */
.movie-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  position: relative;
  z-index: 1;
  padding-top: 40px; /* espace pour le bouton favoris */
}

/* Bouton favoris */
.favorite-toggle {
  position: absolute;
}

/* Poster */
.movie-poster {
  width: 400px;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  flex-shrink: 0;
  background-color: #eee; /* Gris clair si image manquante */
  object-fit: cover;
}

/* Bloc infos */
.movie-info {
  max-width: 95%;
  text-align: justify;
  padding-left: 4%;
  padding-right: 4%;
  background-color: aqua;
  border-radius: 5%;
}

/* Titre */
#title h1 {
  margin-top: 2%;
  padding-left: 2%;
  padding-right: 2%;
  font-size: 2.5em;
  word-break: break-word;
  color: aquamarine;
}

  /* Date */
.release-date {
  font-size: 1em;
  color: black;
  margin-bottom: 10px;
  font-weight: bold;
}

/* Description */
.overview {
  font-size: clamp(1em, 2vw, 2em);
  line-height: 1.5;
  font-weight: bold;
  border-radius: 10px;
  height: 500px;
  width: 100%;
  max-width: 600px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 2%;
  box-sizing: border-box;
}
}

/* Ordinateur */

@media (min-width: 768px){
/* Container flex */
.movie-container {
  display: flex;
  //align-items: flex-start;
  gap: clamp(20px, 8vw, 80px);
  position: relative;
  z-index: 1;
  padding-top: 40px; /* espace pour le bouton favoris */
}

/* Bouton favoris */
.favorite-toggle {
  position: absolute;
}

/* Poster */
.movie-poster {
  width: 400px;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  flex-shrink: 0;
  background-color: #eee; /* Gris clair si image manquante */
  object-fit: cover;
}

/* Bloc infos à droite */
.movie-info {
  max-width: 600px;
  margin-left: auto; /* reste collé à droite */
  text-align: justify;
  padding-left: 3%;
  padding-right: 3%;
  background-color: aqua;
  border-radius: 5%;
}

/* Titre */
#title h1 {
  margin-top: 2%;
  padding-left: 2%;
  padding-right: 2%;
  font-size: 2.5em;
  word-break: break-word;
  color: aquamarine;
}

  /* Date */
.release-date {
  font-size: 1em;
  color: black;
  margin-bottom: 10px;
  font-weight: bold;
}

/* Description */
.overview {
  font-size: clamp(1em, 2vw, 2em);
  line-height: 1.5;
  font-weight: bold;
  border-radius: 10px;
  height: 500px;
  width: 100%;
  max-width: 600px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;
  box-sizing: border-box;
}
}
</style>
