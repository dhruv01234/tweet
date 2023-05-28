
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/TweetsPage.vue') },
      { path: '/:profile', component: () => import('pages/ProfilePage.vue') },
      { path: '/mytweets', component: () => import('pages/Mytweets.vue') },
    ]
  },
  {
    path: '/page',
    component: () => import('layouts/LoginRegLayout.vue'),
    children: [
      {
        path:'login',
        component:()=>import('../components/Login.vue')
      },
      {
        path:'register',
        component:()=>import('../components/Register.vue')
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
