/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// Public routes
router.get('/', async (ctx) => {
  const { default: PagesController } = await import('#controllers/pages_controller')
  return new PagesController().home(ctx)
})
router.get('/about', async (ctx) => {
  const { default: PagesController } = await import('#controllers/pages_controller')
  return new PagesController().about(ctx)
})
router.get('/map', async (ctx) => {
  const { default: PagesController } = await import('#controllers/pages_controller')
  return new PagesController().map(ctx)
})

// Auth routes
router.get('/login', 'auth_controller.showLogin').middleware('guest')
router.post('/login', 'auth_controller.login').middleware('guest')
router.get('/register', 'auth_controller.showRegister').middleware('guest')
router.post('/register', 'auth_controller.register').middleware('guest')
router.post('/logout', 'auth_controller.logout').middleware('auth')

// Projects routes (public)
router.get('/projects', 'projects_controller.index')

// Player routes
router.get('/dashboard', 'projects_controller.dashboard').middleware(['auth', 'player'])
router.get('/projects/create', 'projects_controller.create').middleware(['auth', 'player'])
router.post('/projects', 'projects_controller.store').middleware(['auth', 'player'])
router.get('/projects/:id/edit', 'projects_controller.edit').middleware(['auth', 'player'])
router.post('/projects/:id', 'projects_controller.update').middleware(['auth', 'player'])
router.delete('/projects/:id', 'projects_controller.destroy').middleware(['auth', 'player'])

// Admin routes
router.get('/admin/users', 'admin_controller.users').middleware(['auth', 'admin'])
router.post('/admin/users/:id/role', 'admin_controller.updateUserRole').middleware(['auth', 'admin'])
router.delete('/admin/users/:id', 'admin_controller.deleteUser').middleware(['auth', 'admin'])
