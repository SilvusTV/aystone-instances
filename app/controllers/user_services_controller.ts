import UserService from '#models/user_service'
import { HttpContext } from '@adonisjs/core/http'

export default class UserServicesController {
  async index({ inertia, auth }: HttpContext) {
    const services = await UserService.query().preload('user').orderBy('created_at', 'desc').exec()
    return inertia.render('services/index', { services })
  }

  async show({ inertia, params, auth, response }: HttpContext) {
    const service = await UserService.query().where('id', params.id).preload('user').first()
    if (!service) return response.redirect('/services')
    const canEdit = !!auth.user && (auth.user.id === service.userId || auth.user.role === 'admin')
    return inertia.render('services/show', { service, canEdit })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('services/create')
  }

  async store({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const { title, price, priceCents, description } = request.only(['title', 'price', 'priceCents', 'description'])

    try {
      const parseNumber = (v: unknown): number => {
        if (typeof v === 'number') return v
        if (v === null || v === undefined) return NaN
        const s = String(v).replace(/\s+/g, '').replace(',', '.').trim()
        const n = Number(s)
        return isNaN(n) ? NaN : n
      }

      const centsFromPayload = parseNumber(priceCents)
      const eurosFromPayload = parseNumber(price)

      let computedPriceCents = 0
      if (!isNaN(centsFromPayload)) {
        computedPriceCents = Math.max(0, Math.round(centsFromPayload))
      } else if (!isNaN(eurosFromPayload)) {
        computedPriceCents = Math.max(0, Math.round(eurosFromPayload * 100))
      } else {
        computedPriceCents = 0
      }

      await UserService.create({
        userId: user.id,
        title,
        priceCents: computedPriceCents,
        description: description ?? null,
      })

      session?.flash('success', 'Service créé avec succès')
      return response.redirect('/services')
    } catch (error) {
      console.error('Error creating user service:', error)
      session?.flash('error', 'Erreur lors de la création du service')
      return response.redirect().back()
    }
  }

  async edit({ inertia, params, auth, response }: HttpContext) {
    const service = await UserService.find(params.id)
    if (!service) return response.redirect('/services')
    if (!auth.user || (auth.user.id !== service.userId && auth.user.role !== 'admin')) {
      return response.redirect('/services')
    }
    return inertia.render('services/edit', { service })
  }

  async update({ params, request, response, auth, session }: HttpContext) {
    const service = await UserService.find(params.id)
    if (!service) return response.redirect('/services')
    if (!auth.user || (auth.user.id !== service.userId && auth.user.role !== 'admin')) {
      return response.redirect('/services')
    }

    const { title, price, priceCents, description } = request.only(['title', 'price', 'priceCents', 'description'])

    try {
      const parseNumber = (v: unknown): number => {
        if (typeof v === 'number') return v
        if (v === null || v === undefined) return NaN
        const s = String(v).replace(/\s+/g, '').replace(',', '.').trim()
        const n = Number(s)
        return isNaN(n) ? NaN : n
      }

      const centsFromPayload = parseNumber(priceCents)
      const eurosFromPayload = parseNumber(price)

      let computedPriceCents = 0
      if (!isNaN(centsFromPayload)) {
        computedPriceCents = Math.max(0, Math.round(centsFromPayload))
      } else if (!isNaN(eurosFromPayload)) {
        computedPriceCents = Math.max(0, Math.round(eurosFromPayload * 100))
      } else {
        computedPriceCents = 0
      }

      service.title = title
      service.priceCents = computedPriceCents
      service.description = description ?? null
      await service.save()

      session?.flash('success', 'Service modifié avec succès')
      return response.redirect(`/services/${service.id}`)
    } catch (error) {
      console.error('Error updating user service:', error)
      session?.flash('error', 'Erreur lors de la modification du service')
      return response.redirect().back()
    }
  }

  async destroy({ params, response, auth, session }: HttpContext) {
    const service = await UserService.find(params.id)
    if (!service) return response.redirect('/services')
    if (!auth.user || (auth.user.id !== service.userId && auth.user.role !== 'admin')) {
      return response.redirect('/services')
    }
    await service.delete()
    session?.flash('success', 'Service supprimé avec succès')
    return response.redirect('/services')
  }
}
