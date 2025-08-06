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

// S3 file serving route
router.get('/s3/:directory/:filename', async (ctx) => {
  const { default: S3Controller } = await import('#controllers/s3_controller')
  return new S3Controller().serveFile(ctx)
})

// S3 management routes
router
  .get('/dashboard/s3', async (ctx) => {
    const { default: S3Controller } = await import('#controllers/s3_controller')
    return new S3Controller().dashboard(ctx)
  })
  .middleware([middleware.auth(), middleware.admin()])

router
  .get('/api/s3/files', async (ctx) => {
    const { default: S3Controller } = await import('#controllers/s3_controller')
    return new S3Controller().listFiles(ctx)
  })
  .middleware([middleware.auth(), middleware.admin()])

router
  .post('/api/s3/upload', async (ctx) => {
    const { default: S3Controller } = await import('#controllers/s3_controller')
    return new S3Controller().uploadFile(ctx)
  })
  .middleware([middleware.auth(), middleware.admin()])

router
  .delete('/api/s3/files', async (ctx) => {
    const { default: S3Controller } = await import('#controllers/s3_controller')
    return new S3Controller().deleteFile(ctx)
  })
  .middleware([middleware.auth(), middleware.admin()])

router
  .post('/api/s3/folders', async (ctx) => {
    const { default: S3Controller } = await import('#controllers/s3_controller')
    return new S3Controller().createFolder(ctx)
  })
  .middleware([middleware.auth(), middleware.admin()])

router
  .put('/api/s3/files', async (ctx) => {
    const { default: S3Controller } = await import('#controllers/s3_controller')
    return new S3Controller().renameFile(ctx)
  })
  .middleware([middleware.auth(), middleware.admin()])

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
router
  .get('/utils', async (ctx) => {
    const { default: PagesController } = await import('#controllers/pages_controller')
    return new PagesController().utils(ctx)
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
  .get('/instances/:name', async (ctx) => {
    const { default: InstancesController } = await import('#controllers/instances_controller')
    return new InstancesController().show(ctx)
  })
  .middleware([middleware.silentAuth()])
router
  .get('/instances/:name/projects', async (ctx) => {
    const { default: InstancesController } = await import('#controllers/instances_controller')
    return new InstancesController().projects(ctx)
  })
  .middleware([middleware.silentAuth()])

// Instance description management routes (protected by instanceAdmin middleware)
router
  .get('/instances/:name/description/edit', async (ctx) => {
    const { default: InstancesController } = await import('#controllers/instances_controller')
    return new InstancesController().editDescription(ctx)
  })
  .middleware([middleware.auth(), middleware.instanceAdmin()])

router
  .post('/instances/:name/description', async (ctx) => {
    const { default: InstancesController } = await import('#controllers/instances_controller')
    return new InstancesController().updateDescription(ctx)
  })
  .middleware([middleware.auth(), middleware.instanceAdmin()])

router
  .delete('/instances/:name/description/:id', async (ctx) => {
    const { default: InstancesController } = await import('#controllers/instances_controller')
    return new InstancesController().deleteDescription(ctx)
  })
  .middleware([middleware.auth(), middleware.instanceAdmin()])

router
  .put('/instances/:name/description/:id', async (ctx) => {
    const { default: InstancesController } = await import('#controllers/instances_controller')
    return new InstancesController().editExistingDescription(ctx)
  })
  .middleware([middleware.auth(), middleware.instanceAdmin()])
router
  .get('/instances/:name/members', async (ctx) => {
    const { default: InstancesController } = await import('#controllers/instances_controller')
    return new InstancesController().members(ctx)
  })
  .middleware([middleware.silentAuth()])
router
  .get('/instances/:name/dynmap', async (ctx) => {
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
  .get('/projects/:id', async (ctx) => {
    const { default: ProjectsController } = await import('#controllers/projects_controller')
    return new ProjectsController().show(ctx)
  })
  .middleware([middleware.silentAuth()])
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

// Project collaborators routes
router
  .post('/projects/:id/collaborators', async (ctx) => {
    const { default: ProjectsController } = await import('#controllers/projects_controller')
    return new ProjectsController().addCollaborator(ctx)
  })
  .middleware([middleware.auth(), middleware.player()])

router
  .delete('/projects/:id/collaborators', async (ctx) => {
    const { default: ProjectsController } = await import('#controllers/projects_controller')
    return new ProjectsController().removeCollaborator(ctx)
  })
  .middleware([middleware.auth(), middleware.player()])

// Project ratings routes
router
  .post('/projects/:id/ratings', async (ctx) => {
    const { default: ProjectRatingsController } = await import('#controllers/project_ratings_controller')
    return new ProjectRatingsController().store(ctx)
  })
  .middleware([middleware.auth()])

// Project visit routes (for visiteurPlus role)
router
  .post('/projects/:id/visit', async (ctx) => {
    const { default: ProjectVisitsController } = await import('#controllers/project_visits_controller')
    return new ProjectVisitsController().markAsVisited(ctx)
  })
  .middleware([middleware.auth(), middleware.visiteurPlus()])

router
  .delete('/projects/:id/visit', async (ctx) => {
    const { default: ProjectVisitsController } = await import('#controllers/project_visits_controller')
    return new ProjectVisitsController().markAsNotVisited(ctx)
  })
  .middleware([middleware.auth(), middleware.visiteurPlus()])

router
  .get('/projects/:id/visit', async (ctx) => {
    const { default: ProjectVisitsController } = await import('#controllers/project_visits_controller')
    return new ProjectVisitsController().getVisitStatus(ctx)
  })
  .middleware([middleware.auth()])

router
  .get('/projects/visited', async (ctx) => {
    const { default: ProjectVisitsController } = await import('#controllers/project_visits_controller')
    return new ProjectVisitsController().getVisitedProjects(ctx)
  })
  .middleware([middleware.auth()])

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
