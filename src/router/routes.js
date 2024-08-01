const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'Users', component: () => import('pages/UsersPage.vue') },
      { path: 'Roles', component: () => import('pages/RolesPage.vue') },
      { path: 'Pages', component: () => import('pages/PagesPage.vue') }
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
        component: () => import('pages/Auth/LoginPage.vue')
      },
      {
        path: 'register',
        component: () => import('pages/Auth/RegisterPage.vue')
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
