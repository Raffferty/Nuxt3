// to set the 'users' layout for all routs under the /users
// to not write definePageMeta.layout = 'users' in every page under the /users
export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith('/users')) {
    to.meta.layout = 'users'
  }
})
