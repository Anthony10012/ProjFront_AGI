<template>
  <div class="movie-card">
    <FavoritToggle class="favorite-toggle" :movieId="movie.id" />

    <router-link :to="`/movie/${movie.id}`" class="movie-card-link">
      <img :src="posterUrl" :alt="`Affiche de ${movie.title}`" class="movie-poster" />
      <div class="movie-info">
        <h3>{{ movie.title }}</h3>
        <p class="release-date">Sortie: {{ movie.release_date || 'N/A' }}</p>
        <p class="overview">{{ overviewText }}</p>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import FavoritToggle from "@/components/FavoritToggle.vue";

const props = defineProps({
  movie: { type: Object, required: true },
});

const posterBaseUrl = 'https://image.tmdb.org/t/p/w200';
const placeholderImage = '/assets/placeholder-movie.png';

const posterUrl = props.movie.poster_path
    ? `${posterBaseUrl}${props.movie.poster_path}`
    : placeholderImage;

const overviewText = computed(() => {
  return props.movie.overview
      ? props.movie.overview.substring(0, 150) + (props.movie.overview.length > 150 ? '...' : '')
      : " "; // espace pour garder la hauteur
});
</script>

<style scoped>
.movie-card {
  position: relative;
  display: flex;
  border: 1px solid mediumaquamarine;
  border-radius: 5%;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  background-color: aquamarine;
}

.movie-card-link {
  display: flex;
  flex: 1;
  text-decoration: none;
  color: inherit;
}

.movie-poster {
  width: 100px;
  height: auto;
  object-fit: cover;
  flex-shrink: 0;
}

.movie-info {
  padding: 15px;
  min-height: 120px; /* Toujours la même hauteur */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

h3 { margin: 0; font-size: 1.2em; }
.release-date { font-size: 0.9em; color: #555; }
.overview { font-size: 0.85em; color: #333; }

.favorite-toggle {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}
</style>
