<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  movieId: string | number
}

const props = defineProps<Props>()
const toggleStatus = ref(false)
const favoriteMovies = ref<number[]>([])

/**
 * Fonction pour ajouter ou retirer un film des favoris
 */
function toggleIcon() {
  // Lire les favoris existants depuis localStorage
  const stored = localStorage.getItem('favorites')
  favoriteMovies.value = stored ? JSON.parse(stored).map(Number) : []

  toggleStatus.value = !toggleStatus.value

  if (toggleStatus.value) {
    // Ajouter si pas déjà présent
    if (!favoriteMovies.value.includes(Number(props.movieId))) {
      favoriteMovies.value.push(Number(props.movieId))
    }
  } else {
    // Retirer le film
    favoriteMovies.value = favoriteMovies.value.filter(
        id => id !== Number(props.movieId)
    )
  }

  // Mettre à jour localStorage
  localStorage.setItem('favorites', JSON.stringify(favoriteMovies.value))

  // Notifier la page favoris pour recharger la liste
  window.dispatchEvent(new Event('favoritesUpdated'))
}

/**
 * Mettre à jour le toggleStatus au montage et quand movieId change
 */
watch(
    () => props.movieId,
    (newId) => {
      const stored = localStorage.getItem('favorites')
      const favorites: number[] = stored ? JSON.parse(stored).map(Number) : []
      toggleStatus.value = favorites.includes(Number(newId))
    },
    { immediate: true }
)
</script>

<template>
  <div class="favorite-toggle">
    <button @click.stop="toggleIcon">
      <span :class="toggleStatus ? 'full' : 'empty'">
        {{ toggleStatus ? '❤️' : '🤍' }}
      </span>
    </button>
  </div>
</template>

<style scoped>
button {
  cursor: pointer;
  border: none;
  background: inherit;
  font-size: var(--heart-size-md);
}

.full {
  color: var(--heart-full);
}

.empty {
  color: var(--heart-empty);
}
</style>