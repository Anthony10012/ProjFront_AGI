import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetailsView from "@/views/DetailsView.vue";
import FavoriteView from "@/views/FavoriteView.vue";

import MoviesView from "@/views/MoviesView.vue";
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue'),
        },
        {
            path:'/movie/:id',
            name:'movie-details',
            component: DetailsView,
            props: true,
        },
        {
            path:'/movies',
            name:'Movies',
            component: MoviesView
        },
        {
            path: '/favoris',
            name: 'favoris',
            component: FavoriteView,
            props:true,
        }
    ],
})

export default router