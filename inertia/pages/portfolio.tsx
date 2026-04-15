import React, { useEffect, useMemo, useState } from 'react'
import Layout from '@/components/layout'

type PortfolioEntry = {
  id?: number
  kind: 'project' | 'event' | 'experience' | 'skill'
  title: string
  summary: string
  highlighted: boolean
  startYear: number | null
  endYear: number | null
  technologies: string[]
  context: string | null
  metric: string | null
  order: number
}

const labelByKind: Record<PortfolioEntry['kind'], string> = {
  project: 'Projet',
  event: 'Événement',
  experience: 'Expérience',
  skill: 'Compétence',
}

const gradientsByKind: Record<PortfolioEntry['kind'], string> = {
  project: 'from-indigo-500/20 to-cyan-500/10',
  event: 'from-fuchsia-500/20 to-orange-500/10',
  experience: 'from-emerald-500/20 to-blue-500/10',
  skill: 'from-violet-500/20 to-sky-500/10',
}

export default function PortfolioPage() {
  const [entries, setEntries] = useState<PortfolioEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data: PortfolioEntry[]) => setEntries(data))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false))
  }, [])

  const highlightedEntries = useMemo(() => entries.filter((entry) => entry.highlighted), [entries])

  return (
    <Layout>
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gray-950 px-6 py-10 text-white shadow-2xl">
        <div className="pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <p className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/70">
              Developer x Broadcast
            </p>
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">
              Portfolio atypique, sobre et orienté impact.
            </h1>
            <p className="mt-5 max-w-2xl text-sm text-white/80 md:text-base">
              Je conçois des outils fullstack et des workflows live pour produire des expériences
              fiables en contexte broadcast: architecture backend AdonisJS, front Inertia + React,
              data SQL et exécution terrain sur des événements à forte exposition.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs md:text-sm">
              {['AdonisJS', 'Inertia', 'React', 'SQL', 'Fetch API', 'Broadcast Ops'].map(
                (badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-white/85"
                  >
                    {badge}
                  </span>
                )
              )}
            </div>
          </div>

          <aside className="rounded-2xl border border-white/20 bg-white/5 p-5 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              CV Snapshot
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/90">
              <li>• Profil hybride: développement produit + ingénierie de diffusion.</li>
              <li>• Conception d&apos;API, structuration SQL et surfaces UI pragmatiques.</li>
              <li>• Coordination d&apos;équipes et pilotage de runbooks en conditions live.</li>
              <li>• Culture de la fiabilité: monitoring, fallback, amélioration continue.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Focus projets & événements</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Design épuré, ton direct, impact visible.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            Chargement du portfolio...
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {highlightedEntries.map((entry) => (
              <article
                key={`${entry.kind}-${entry.title}`}
                className={`rounded-2xl border border-gray-200 bg-gradient-to-br ${gradientsByKind[entry.kind]} p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700`}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-gray-300 bg-white/70 px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-900/50 dark:text-gray-200">
                    {labelByKind[entry.kind]}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {entry.startYear ?? 'N/A'}
                    {entry.endYear ? ` → ${entry.endYear}` : ''}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{entry.title}</h3>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{entry.summary}</p>
                <p className="mt-3 text-xs text-gray-600 dark:text-gray-300">
                  <strong>Contexte:</strong> {entry.context ?? '—'}
                </p>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                  <strong>Impact:</strong> {entry.metric ?? '—'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.technologies.map((technology) => (
                    <span
                      key={`${entry.title}-${technology}`}
                      className="rounded-full border border-gray-300 bg-white/70 px-2 py-0.5 text-[11px] text-gray-700 dark:border-gray-600 dark:bg-gray-900/60 dark:text-gray-200"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-xl font-semibold">Timeline complète</h2>
        <div className="mt-5 space-y-4">
          {entries.map((entry) => (
            <div key={`timeline-${entry.kind}-${entry.title}`} className="relative pl-6">
              <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-violet-500" />
              <p className="text-xs uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
                {labelByKind[entry.kind]} • {entry.startYear ?? 'N/A'}
                {entry.endYear ? ` → ${entry.endYear}` : ''}
              </p>
              <h3 className="text-base font-medium">{entry.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{entry.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}
