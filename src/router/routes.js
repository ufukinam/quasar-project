const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },

  // /auth/login
  // /auth/register
  {
    path: '/auth',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('pages/LoginPage.vue')
      },
      {
        path: 'register',
        component: () => import('pages/RegisterPage.vue')
      }
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
