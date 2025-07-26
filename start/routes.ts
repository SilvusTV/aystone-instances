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

// Instances routes
router
  .get('/instances', async (ctx) => {
    const { default: InstancesController } = await import('#controllers/instances_controller')
    return new InstancesController().index(ctx)
  })
  .middleware([middleware.silentAuth()])
router
  .get('/instances/:id', async (ctx) => {
    const { default: InstancesController } = await import('#controllers/instances_controller')
    return new InstancesController().show(ctx)
  })
  .middleware([middleware.silentAuth()])
router
  .get('/instances/:id/projects', async (ctx) => {
    const { default: InstancesController } = await import('#controllers/instances_controller')
    return new InstancesController().projects(ctx)
  })
  .middleware([middleware.silentAuth()])
router
  .get('/instances/:id/description', async (ctx) => {
    const { default: InstancesController } = await import('#controllers/instances_controller')
    return new InstancesController().description(ctx)
  })
  .middleware([middleware.silentAuth()])

// Instance description management routes (protected by instanceAdmin middleware)
router
  .get('/instances/:id/description/edit', async (ctx) => {
    const { default: InstancesController } = await import('#controllers/instances_controller')
    return new InstancesController().editDescription(ctx)
  })
  .middleware([middleware.auth(), middleware.instanceAdmin()])

router
  .post('/instances/:id/description', async (ctx) => {
    const { default: InstancesController } = await import('#controllers/instances_controller')
    return new InstancesController().updateDescription(ctx)
  })
  .middleware([middleware.auth(), middleware.instanceAdmin()])
router
  .get('/instances/:id/members', async (ctx) => {
    const { default: InstancesController } = await import('#controllers/instances_controller')
    return new InstancesController().members(ctx)
  })
  .middleware([middleware.silentAuth()])
router
  .get('/instances/:id/dynmap', async (ctx) => {
    const { default: InstancesController } = await import('#controllers/instances_controller')
    return new InstancesController().dynmap(ctx)
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

// Password reset routes
router
  .get('/forgot-password', async (ctx) => {
    const { default: AuthController } = await import('#controllers/auth_controller')
    return new AuthController().showForgotPassword(ctx)
  })
  .middleware([middleware.guest()])

router
  .post('/forgot-password', async (ctx) => {
    const { default: AuthController } = await import('#controllers/auth_controller')
    return new AuthController().forgotPassword(ctx)
  })
  .middleware([middleware.guest()])

// Route for password reset page
router
  .get('/reset-password', async (ctx) => {
    console.log('Reset password route hit with query:', ctx.request.qs())
    const { default: AuthController } = await import('#controllers/auth_controller')
    return new AuthController().showResetPassword(ctx)
  })
  // No middleware for debugging purposes
  // .middleware([middleware.guest()])

router
  .post('/reset-password', async (ctx) => {
    const { default: AuthController } = await import('#controllers/auth_controller')
    return new AuthController().resetPassword(ctx)
  })
  .middleware([middleware.guest()])

// Profile routes (accessible only to authenticated users)
router
  .get('/profile', async (ctx) => {
    const { default: ProfileController } = await import('#controllers/profile_controller')
    return new ProfileController().show(ctx)
  })
  .middleware([middleware.auth()])
router
  .post('/profile/email', async (ctx) => {
    const { default: ProfileController } = await import('#controllers/profile_controller')
    return new ProfileController().updateEmail(ctx)
  })
  .middleware([middleware.auth()])
router
  .post('/profile/password', async (ctx) => {
    const { default: ProfileController } = await import('#controllers/profile_controller')
    return new ProfileController().updatePassword(ctx)
  })
  .middleware([middleware.auth()])
router
  .delete('/profile/delete', async (ctx) => {
    const { default: ProfileController } = await import('#controllers/profile_controller')
    return new ProfileController().deleteAccount(ctx)
  })
  .middleware([middleware.auth()])

// Test route for debugging
router
  .get('/test-reset', async (ctx) => {
    return ctx.inertia.render('test-reset')
  })

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

router
  .post('/admin/users/:id/reset-password', async (ctx) => {
    const { default: AdminController } = await import('#controllers/admin_controller')
    return new AdminController().resetPassword(ctx)
  })
  .middleware([middleware.auth(), middleware.admin()])

router
  .post('/admin/users/:id/instance', async (ctx) => {
    const { default: AdminController } = await import('#controllers/admin_controller')
    return new AdminController().updateUserInstance(ctx)
  })
  .middleware([middleware.auth(), middleware.admin()])

router
  .get('/admin/instances', async (ctx) => {
    const { default: AdminController } = await import('#controllers/admin_controller')
    return new AdminController().instances(ctx)
  })
  .middleware([middleware.auth(), middleware.admin()])

router
  .post('/admin/instances', async (ctx) => {
    const { default: AdminController } = await import('#controllers/admin_controller')
    return new AdminController().createInstance(ctx)
  })
  .middleware([middleware.auth(), middleware.admin()])

router
  .post('/admin/instances/:id/image', async (ctx) => {
    const { default: AdminController } = await import('#controllers/admin_controller')
    return new AdminController().updateInstanceImage(ctx)
  })
  .middleware([middleware.auth(), middleware.admin()])
