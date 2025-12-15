<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import FavoritToggle from "@/components/FavoritToggle.vue"

const apiKey = "d7a3a9b7bf495277a0437c9f4031d048"

const favoriteIds = ref<(string | number)[]>([])
const favoriteMovies = ref<any[]>([])

/**
 * Charge les favoris depuis localStorage et récupère les infos complètes
 */
const loadFavorites = async () => {
  const stored = localStorage.getItem('favorites')
  favoriteIds.value = stored ? JSON.parse(stored) : []

  if (favoriteIds.value.length === 0) {
    favoriteMovies.value = []
    return
  }

  const movies = await Promise.all(
      favoriteIds.value.map(async id => {
        try {
          const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=fr-FR`)
          return await res.json()
        } catch {
          return null
        }
      })
  )

  favoriteMovies.value = movies.filter(movie => movie && movie.poster_path)

  // Nettoyer localStorage pour enlever les films invalides
  favoriteIds.value = favoriteMovies.value.map(movie => movie.id)
  localStorage.setItem('favorites', JSON.stringify(favoriteIds.value))
}

onMounted(() => {
  loadFavorites()

  // Écoute les changements de favoris depuis FavoritToggle
  window.addEventListener('favoritesUpdated', loadFavorites)
})

onBeforeUnmount(() => {
  window.removeEventListener('favoritesUpdated', loadFavorites)
})
</script>

<template>
  <div class="favorites-page">
    <h1>Mes favoris</h1>

    <div v-if="favoriteMovies.length === 0" class="empty-message">
      Aucun favori pour le moment.
    </div>

    <div v-else class="movies-grid">
      <div v-for="movie in favoriteMovies" :key="movie.id" class="movie-card">
        <!-- Cœur -->
        <FavoritToggle class="favorite-toggle" :movieId="movie.id" />

        <!-- Lien vers la page du film -->
        <router-link :to="`/movie/${movie.id}`" class="movie-link">
          <img
              :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`"
              :alt="movie.title"
              class="movie-poster"
          />
          <div class="movie-info">
            <h3>{{ movie.title }}</h3>
            <p class="release-date">Sortie: {{ movie.release_date || 'N/A' }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.favorites-page {
  padding: 20px;
}

.empty-message {
  font-size: 1.2em;
  color: #555;
}

/* Grid responsive */
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.movie-card {
  position: relative;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  padding: 10px;
  padding-top: 40px; /* espace pour le cœur */
  background-color: #fff;
  transition: transform 0.2s;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.favorite-toggle {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.movie-link {
  text-decoration: none;
  color: inherit;
}

.movie-poster {
  width: 100%;
  border-radius: 4px;
}

.movie-info {
  margin-top: 10px;
}

h3 {
  margin: 0 0 5px 0;
  font-size: 1em;
}

.release-date {
  font-size: 0.85em;
  color: #555;
}
</style>
