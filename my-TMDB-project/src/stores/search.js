import { defineStore } from 'pinia';

// Récupérer la clé API de l'environnement
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = 'https://api.themoviedb.org/3/search/movie';

export const useSearchStore = defineStore('search', {
    state: () => ({
        results: [],
        query: '',
        isLoading: false,
        error: null,
    }),
    actions: {
        /**
         * 🔎 Implémentation du moteur de recherche
         * @param {string} newQuery - Le terme de recherche
         */
        async searchMovies(newQuery) {
            if (!newQuery.trim()) {
                this.results = [];
                this.error = null;
                return;
            }

            this.query = newQuery;
            this.isLoading = true;
            this.error = null;

            try {
                const response = await fetch(`${API_URL}?api_key=${API_KEY}&query=${encodeURIComponent(newQuery)}&language=fr-FR`);

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const data = await response.json();

                // ✅ Affichage des résultats
                this.results = data.results;

            } catch (err) {
                // ❌ Gestion des erreurs
                console.error("Erreur lors de la recherche TMDB:", err);
                this.error = "Impossible de récupérer les résultats. Veuillez réessayer.";
                this.results = [];

            } finally {
                // 🔄 Gestion du chargement
                this.isLoading = false;
            }
        }
    }
});