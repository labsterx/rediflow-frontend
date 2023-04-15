import { createRouter, createWebHistory } from 'vue-router'
import {config} from '../config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      name: 'PublicHome',
      component: () => import('../views/public/PublicHomeView.vue'),
    }, 

    {
      path: '/about/',
      name: 'About',
      component: () => import('../views/public/AboutView.vue'),
    },
    
    {
      path: '/login/',
      name: 'Login',
      component: () => import('../views/public/LoginView.vue'),
    },  

    {
      path: '/app/',
      name: '',
      children: [
        {
          path: '',
          name: 'AppHome',
          component: () => import('../views/app/AppHomeView.vue'),
        },
        {
          path: 'user/',
          name: 'UserDefault',
          component: () => import('../views/app/UserView.vue'),
        },          
        {
          path: 'user/:userAddress',
          name: 'User',
          component: () => import('../views/app/UserView.vue'),
        },
        {
          path: 'video/:assetId',
          name: 'Video',
          component: () => import('../views/app/LivepeerVideoView.vue'),
        },                
        {
          path: 'logout/',
          name: 'Logout',
          component: () => import('../views/app/LogoutView.vue'),
        },               
      ],
    },

    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path.includes('/app/')) {
    if (!localStorage.getItem(config.localStorageKey.login)) {
      // console.log('no jwtToken, redirecting to login')
      router.push({ name: 'Login', query: { redirect: to.path }})
    }
  }
  next()
})


export default router
