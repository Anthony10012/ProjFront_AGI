# ProjFront_AGI

# Installation  du projet 

1. Utiliser un interface de développement (Intellij,VS Code)

2. Cloner ce dépôt avec cette commande:
<br>git clone https://github.com/Anthony10012/ProjFront_AGI.git<br>

3. Aller dans le terminal et taper ces commandes dans l'ordre:

**Pour créer le projet Vue.js** 
<br>npm create vue@latest my-TMDB-project<br>

**Aller a la racine du projet**
<br>cd my-TMDB-project<br>

**Installer toute les dépendances du projet**
<br>npm install<br>

 **Lancer le projet**
<br>npm run dev<br>


# Présentation de la structure du projet	



# Explication de l’API choisie et de son intégration

**Lien vers l'API utilisée**
<br>https://www.themoviedb.org/<br>

**Clé API**
Pour utiliser, The Movie Database, il faut créer un compte puis récupérer un Token d'accès API v4 dans:
Settings -> API -> API Read Access Token (v4 auth)

La clé doit être placée dans un fichier .env :
VITE_TMDB_TOKEN=TON_TOKEN_ICI

**Exemple de requête ou d'intégration**


La requête vers TheMovieDB (TMDB) se trouve ici :

const response = await fetch(
  `${API_URL}?api_key=${API_KEY}&query=${encodeURIComponent(newQuery)}&language=fr-FR`
);


Intégration dans un store Pinia

export const useSearchStore = defineStore('search', {


Le store centralise :

l’état (results, isLoading, error)

la logique métier (searchMovies)
