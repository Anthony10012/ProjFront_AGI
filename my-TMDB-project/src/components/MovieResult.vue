<script setup>
import { defineProps } from 'vue';
import FavoritToggle from "@/components/FavoritToggle.vue";

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const posterBaseUrl = 'https://image.tmdb.org/t/p/w200';
const placeholderImage = '/assets/placeholder-movie.png'; // Créez cette image si nécessaire

const posterUrl = props.movie.poster_path
    ? `${posterBaseUrl}${props.movie.poster_path}`
    : placeholderImage;
</script>

<template>
  <div class="movie-card">
    <FavoritToggle
        class="favorite-toggle"
        :movieId="movie.id"
    />


    <router-link :to="`/movie/${movie.id}`">
        <img :src="posterUrl" :alt="`Affiche de ${movie.title}`" class="movie-poster" />
        <div class="movie-info">
          <h3>{{ movie.title }}</h3>
          <p class="release-date">Sortie: {{ movie.release_date || 'N/A' }}</p>
          <p class="overview">{{ movie.overview.substring(0, 150) + (movie.overview.length > 150 ? '...' : '') }}</p>
      </div>
      </router-link>
    </div>
</template>

<style scoped>
.movie-card {
  display: flex;
  position: relative;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.movie-poster {
  width: 100px;
  height: auto;
  object-fit: cover;
  flex-shrink: 0;
}
.movie-info {
  padding: 15px;
}
h3 {
  margin-top: 0;
  font-size: 1.2em;
}
.release-date {
  font-size: 0.9em;
  color: #555;
}
.overview {
  font-size: 0.85em;
  color: #333;
}
.favorite-toggle {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}
</style>