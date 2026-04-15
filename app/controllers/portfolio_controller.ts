import { HttpContext } from '@adonisjs/core/http'
import PortfolioEntry from '#models/portfolio_entry'

const portfolioFallback = [
  {
    kind: 'project',
    title: 'GBA Explorer',
    summary:
      'Plateforme orientée data & live pour explorer les moments clés de production et la coordination technique.',
    highlighted: true,
    startYear: 2024,
    endYear: null,
    technologies: ['AdonisJS', 'React', 'Inertia', 'PostgreSQL'],
    context: 'Broadcast / product engineering',
    metric: 'Architecture orientée scalabilité',
    order: 1,
  },
  {
    kind: 'event',
    title: 'Z Event',
    summary:
      'Conception et support d’outils de diffusion, de coordination équipe et de fiabilité production.',
    highlighted: true,
    startYear: 2023,
    endYear: 2025,
    technologies: ['Streaming ops', 'Observability', 'Automation'],
    context: 'Événement caritatif live',
    metric: 'Production multi-équipes',
    order: 2,
  },
  {
    kind: 'experience',
    title: 'Kick League',
    summary:
      'Mise en place de workflows broadcast et d’assets interactifs pour les émissions en direct.',
    highlighted: true,
    startYear: 2025,
    endYear: null,
    technologies: ['Realtime workflows', 'Overlay systems'],
    context: 'Compétition esport / creator economy',
    metric: 'Exécution live haute fréquence',
    order: 3,
  },
  {
    kind: 'project',
    title: 'Stream stack (Remote, Widget, Relay, Backbone)',
    summary:
      'Écosystème de services internes pour piloter, distribuer et fiabiliser les opérations de stream.',
    highlighted: true,
    startYear: 2024,
    endYear: null,
    technologies: ['API design', 'Event-driven', 'Monitoring'],
    context: 'Tooling développeur + broadcast',
    metric: 'Suite modulaire & réutilisable',
    order: 4,
  },
  {
    kind: 'experience',
    title: 'Les 2 équipes pour Humanity',
    summary:
      'Coordination transversale produit / live avec focus sur la communication, la cadence et la fiabilité.',
    highlighted: false,
    startYear: 2024,
    endYear: 2025,
    technologies: ['Leadership', 'Delivery', 'Planning'],
    context: 'Organisation multi-profils',
    metric: 'Pilotage et alignement des équipes',
    order: 5,
  },
  {
    kind: 'skill',
    title: 'Compétences clés',
    summary:
      'Product thinking, architecture fullstack Adonis + Inertia, broadcast engineering, fiabilité opérationnelle.',
    highlighted: false,
    startYear: null,
    endYear: null,
    technologies: ['TypeScript', 'AdonisJS', 'React', 'SQL', 'Fetch API'],
    context: 'Profil hybride développeur / broadcast',
    metric: 'Impact technique + delivery',
    order: 6,
  },
]

export default class PortfolioController {
  async index({ response }: HttpContext) {
    const dbItems = await PortfolioEntry.query()
      .orderBy('order', 'asc')
      .orderBy('createdAt', 'desc')

    if (dbItems.length > 0) {
      return response.ok(dbItems)
    }

    return response.ok(portfolioFallback)
  }

  async show({ inertia }: HttpContext) {
    return inertia.render('portfolio')
  }
}
