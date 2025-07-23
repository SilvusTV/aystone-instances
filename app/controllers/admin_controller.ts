import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class AdminController {
  async users({ inertia }: HttpContext) {
    const users = await User.all()
    return inertia.render('admin/users', { users })
  }

  async updateUserRole({ params, request, response }: HttpContext) {
    const user = await User.find(params.id)
    
    if (!user) {
      return response.redirect('/admin/users')
    }

    const { role } = request.only(['role'])
    
    if (!['invité', 'joueur', 'admin'].includes(role)) {
      return response.redirect('/admin/users')
    }

    user.role = role
    await user.save()

    return response.redirect('/admin/users')
  }

  async deleteUser({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    
    if (!user) {
      return response.redirect('/admin/users')
    }

    await user.delete()

    return response.redirect('/admin/users')
  }
}