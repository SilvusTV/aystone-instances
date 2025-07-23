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
router
  .get('/', async (ctx) => {
    const { default: PagesController } = await import('#controllers/pages_controller')
    return new PagesController().home(ctx)
  })
  .middleware([middleware.silentAuth()])
router
  .get('/about', async (ctx) => {
    const { default: PagesController } = await import('#controllers/pages_controller')
    return new PagesController().about(ctx)
  })
  .middleware([middleware.silentAuth()])
router
  .get('/map', async (ctx) => {
    const { default: PagesController } = await import('#controllers/pages_controller')
    return new PagesController().map(ctx)
  })
  .middleware([middleware.silentAuth()])

// Auth routes
router
  .get('/login', async (ctx) => {
    const { default: AuthController } = await import('#controllers/auth_controller')
    return new AuthController().showLogin(ctx)
  })
  .middleware([middleware.guest()])
router
  .post('/login', async (ctx) => {
    const { default: AuthController } = await import('#controllers/auth_controller')
    return new AuthController().login(ctx)
  })
  .middleware([middleware.guest()])
router
  .get('/register', async (ctx) => {
    const { default: AuthController } = await import('#controllers/auth_controller')
    return new AuthController().showRegister(ctx)
  })
  .middleware([middleware.guest()])
router
  .post('/register', async (ctx) => {
    const { default: AuthController } = await import('#controllers/auth_controller')
    return new AuthController().register(ctx)
  })
  .middleware([middleware.guest()])
router
  .post('/logout', async (ctx) => {
    const { default: AuthController } = await import('#controllers/auth_controller')
    return new AuthController().logout(ctx)
  })
  .middleware([middleware.auth()])

// Projects routes (public)
router
  .get('/projects', async (ctx) => {
    const { default: ProjectsController } = await import('#controllers/projects_controller')
    return new ProjectsController().index(ctx)
  })
  .middleware([middleware.silentAuth()])

// Player routes
router
  .get('/dashboard', async (ctx) => {
    const { default: ProjectsController } = await import('#controllers/projects_controller')
    return new ProjectsController().dashboard(ctx)
  })
  .middleware([middleware.auth(), middleware.player()])
router
  .get('/projects/create', async (ctx) => {
    const { default: ProjectsController } = await import('#controllers/projects_controller')
    return new ProjectsController().create(ctx)
  })
  .middleware([middleware.auth(), middleware.player()])
router
  .post('/projects', async (ctx) => {
    const { default: ProjectsController } = await import('#controllers/projects_controller')
    return new ProjectsController().store(ctx)
  })
  .middleware([middleware.auth(), middleware.player()])
router
  .get('/projects/:id/edit', async (ctx) => {
    const { default: ProjectsController } = await import('#controllers/projects_controller')
    return new ProjectsController().edit(ctx)
  })
  .middleware([middleware.auth(), middleware.player()])
router
  .post('/projects/:id', async (ctx) => {
    const { default: ProjectsController } = await import('#controllers/projects_controller')
    return new ProjectsController().update(ctx)
  })
  .middleware([middleware.auth(), middleware.player()])
router
  .delete('/projects/:id', async (ctx) => {
    const { default: ProjectsController } = await import('#controllers/projects_controller')
    return new ProjectsController().destroy(ctx)
  })
  .middleware([middleware.auth(), middleware.player()])

// User config routes
router
  .get('/api/config/:key', async (ctx) => {
    const { default: ConfigController } = await import('#controllers/config_controller')
    return new ConfigController().get(ctx)
  })
  .middleware([middleware.auth()])

router
  .post('/api/config', async (ctx) => {
    const { default: ConfigController } = await import('#controllers/config_controller')
    return new ConfigController().save(ctx)
  })
  .middleware([middleware.auth()])

// Admin routes
router
  .get('/admin/users', async (ctx) => {
    const { default: AdminController } = await import('#controllers/admin_controller')
    return new AdminController().users(ctx)
  })
  .middleware([middleware.auth(), middleware.admin()])

router
  .post('/admin/users/:id/role', async (ctx) => {
    const { default: AdminController } = await import('#controllers/admin_controller')
    return new AdminController().updateUserRole(ctx)
  })
  .middleware([middleware.auth(), middleware.admin()])

router
  .delete('/admin/users/:id', async (ctx) => {
    const { default: AdminController } = await import('#controllers/admin_controller')
    return new AdminController().deleteUser(ctx)
  })
  .middleware([middleware.auth(), middleware.admin()])
