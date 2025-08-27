import React, { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import Layout from '@/components/layout'
import InstanceNav from '@/components/InstanceNav'
import { Instance, PageProps, User, UserService } from '@/types'

interface ServicePageProps extends PageProps {
  instance: Instance
  userServices?: (UserService & { user?: User })[]
  canManageUserServices?: boolean
}

function formatPrice(priceCents: number): string {
  if (!priceCents || priceCents === 0) return 'Gratuit'
  const euros = (priceCents / 100).toFixed(2)
  return `${euros.replace('.', ',')} Unitées`
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR')
  } catch {
    return iso
  }
}

export default function InstanceServicePage({ instance, userServices = [], canManageUserServices = false }: ServicePageProps) {
  const { auth } = usePage<PageProps>().props
  const currentUser = auth?.user || null
  const isAdmin = currentUser?.role === 'admin'

  // Local states for creating and editing user services
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [isFree, setIsFree] = useState(true)
  const [createData, setCreateData] = useState({ title: '', price: '', description: '' })

  const [EditorComponent, setEditorComponent] = useState<React.ComponentType<any> | null>(null)
  const [editorLibs, setEditorLibs] = useState<any>(null)
  const [editorState, setEditorState] = useState<any>(null)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<{ title: string; price: string; description: string }>({ title: '', price: '', description: '' })

  React.useEffect(() => {
    if (!showCreateModal) return
    let mounted = true
    ;(async () => {
      try {
        // Polyfill for draft-js expectations
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof (globalThis as any).global === 'undefined') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(globalThis as any).global = globalThis as any
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof (globalThis as any).process === 'undefined') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(globalThis as any).process = { env: { NODE_ENV: (typeof process !== 'undefined' && (process as any).env && (process as any).env.NODE_ENV) || 'development' } }
        }
        const [{ Editor }, draftJs, htmlToDraftMod, draftToHtmlMod] = await Promise.all([
          import('react-draft-wysiwyg'),
          import('draft-js'),
          import('html-to-draftjs'),
          import('draftjs-to-html'),
          import('react-draft-wysiwyg/dist/react-draft-wysiwyg.css'),
        ])
        if (!mounted) return
        const libs = {
          EditorState: draftJs.EditorState,
          ContentState: draftJs.ContentState,
          convertToRaw: draftJs.convertToRaw,
          htmlToDraft: (htmlToDraftMod as any).default || htmlToDraftMod,
          draftToHtml: (draftToHtmlMod as any).default || draftToHtmlMod,
        }
        setEditorComponent(() => Editor as any)
        setEditorLibs(libs)

        const html = modalMode === 'edit' ? (createData.description || '') : ''
        if (html && typeof html === 'string' && html.trim().length > 0) {
          const blocks = libs.htmlToDraft(html)
          const contentState = libs.ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap)
          setEditorState(libs.EditorState.createWithContent(contentState))
        } else {
          const empty = libs.EditorState.createEmpty()
          setEditorState(empty)
          // Only initialize description for create mode to avoid overwriting edit content
          if (modalMode === 'create') {
            const raw = libs.convertToRaw(empty.getCurrentContent())
            setCreateData((d) => ({ ...d, description: libs.draftToHtml(raw) }))
          }
        }
      } catch (e) {
        console.error('Failed to load editor libs:', e)
      }
    })()
    return () => {
      mounted = false
    }
  }, [showCreateModal, modalMode])

  const onEditorStateChange = (state: any) => {
    setEditorState(state)
    if (!editorLibs) return
    const raw = editorLibs.convertToRaw(state.getCurrentContent())
    const html = editorLibs.draftToHtml(raw)
    setCreateData((d) => ({ ...d, description: html }))
  }

  const uploadImage = async (file: File): Promise<{ data: { link: string } }> => {
    const formData = new FormData()
    formData.append('image', file)

    // Read CSRF token from cookie set by Adonis Shield (enableXsrfCookie)
    const match = typeof document !== 'undefined' ? document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)')) : null
    const token = match ? decodeURIComponent(match[2]) : ''

    const res = await fetch(`/api/instances/${instance.name}/user-services/upload-image`, {
      method: 'POST',
      body: formData,
      headers: {
        'X-XSRF-TOKEN': token,
      },
      credentials: 'same-origin',
    })

    if (!res.ok) {
      if (res.status === 419) {
        // Token expired or invalid: reload to refresh session/CSRF cookie
        if (typeof window !== 'undefined') window.location.reload()
      }
      throw new Error('Upload failed')
    }

    const json = await res.json()
    return { data: { link: json.url } }
  }

  const closeModal = () => {
    setShowCreateModal(false)
    setEditingId(null)
    setModalMode('create')
    setIsFree(true)
    setCreateData({ title: '', price: '', description: '' })
    setEditorState(null)
  }

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (modalMode === 'edit' && editingId) {
      router.post(`/instances/${instance.name}/user-services/${editingId}`, {
        title: createData.title,
        price: isFree ? '' : createData.price,
        priceCents: isFree ? 0 : undefined,
        description: createData.description,
      })
    } else {
      router.post(`/instances/${instance.name}/user-services`, {
        title: createData.title,
        price: isFree ? '' : createData.price,
        priceCents: isFree ? 0 : undefined,
        description: createData.description,
      })
    }
  }

  const startEdit = (s: UserService) => {
    setEditingId(s.id)
    setModalMode('edit')
    setIsFree(!s.priceCents || s.priceCents === 0)
    setCreateData({
      title: s.title,
      price: s.priceCents ? (s.priceCents / 100).toString() : '',
      description: s.description || '',
    })
    setShowCreateModal(true)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const submitEdit = (e: React.FormEvent, id: number) => {
    e.preventDefault()
    router.post(`/instances/${instance.name}/user-services/${id}`, {
      title: editData.title,
      price: editData.price,
      description: editData.description,
    })
  }

  const remove = (id: number) => {
    if (confirm('Supprimer ce service ?')) {
      router.delete(`/instances/${instance.name}/user-services/${id}`)
    }
  }

  return (
    <Layout>
      <Head title={`Service - ${instance.name}`} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Service de l'instance: {instance.name}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <Link href={`/instances/${instance.name}`} className="text-primary-600 hover:text-primary-800 dark:text-primary-400">
            &larr; Retour à l'aperçu
          </Link>
        </div>
      </div>

      <InstanceNav instanceName={instance.name} />


      {/* User Services Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Services des joueurs</h2>

        {canManageUserServices && (
          <div className="mb-6">
            <button
              onClick={() => { setModalMode('create'); setEditingId(null); setIsFree(true); setCreateData({ title: '', price: '', description: '' }); setShowCreateModal(true) }}
              className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition"
            >
              Proposer un service
            </button>

            {showCreateModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/60" onClick={closeModal} />
                <div className="relative z-10 w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{modalMode === 'edit' ? 'Modifier le service' : 'Nouveau service'}</h3>
                    <style>{`
                      .dark .rdw-toolbar {
                        background-color: #1f2937 !important;
                        border: 1px solid #374151 !important;
                      }
                      .dark .rdw-option-wrapper {
                        background-color: #374151 !important;
                        color: #e5e7eb !important;
                        border: 1px solid #4b5563 !important;
                      }
                      .dark .rdw-option-wrapper:hover {
                        background-color: #4b5563 !important;
                      }
                      .dark .rdw-dropdown-wrapper {
                        background-color: #374151 !important;
                        color: #e5e7eb !important;
                        border: 1px solid #4b5563 !important;
                      }
                      .dark .rdw-dropdown-wrapper:hover {
                        background-color: #4b5563 !important;
                      }
                      .dark .rdw-editor-main {
                        background-color: #111827 !important;
                        color: #e5e7eb !important;
                        padding: 0.5rem !important;
                      }
                      .dark .rdw-link-modal, .dark .rdw-emoji-modal, .dark .rdw-image-modal {
                        background-color: #1f2937 !important;
                        color: #e5e7eb !important;
                      }
                    `}</style>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">✕</button>
                  </div>

                  <form onSubmit={onCreate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Titre</label>
                        <input
                          type="text"
                          className="w-full border rounded px-3 py-2 dark:bg-gray-700"
                          placeholder="Titre du service"
                          value={createData.title}
                          onChange={(e) => setCreateData({ ...createData, title: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Prix (unités)</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            className="flex-1 border rounded px-3 py-2 dark:bg-gray-700 disabled:opacity-60"
                            placeholder="ex: 10.5"
                            value={isFree ? '' : createData.price}
                            onChange={(e) => setCreateData({ ...createData, price: e.target.value })}
                            disabled={isFree}
                          />
                          <label className="inline-flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} />
                            Gratuit
                          </label>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Laissez vide ou cochez "Gratuit" pour un service gratuit.</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      {EditorComponent ? (
                        <div className="border rounded">
                          <EditorComponent
                            editorState={editorState}
                            onEditorStateChange={onEditorStateChange}
                            toolbar={{
                              options: ['inline','blockType','fontSize','list','textAlign','colorPicker','link','image','remove','history'],
                              image: { uploadCallback: uploadImage, previewImage: true, alt: { present: true, mandatory: false } },
                            }}
                            wrapperClassName="rdw-wrapper"
                            editorClassName="rdw-editor px-3 min-h-[160px]"
                            toolbarClassName="rdw-toolbar"
                          />
                        </div>
                      ) : (
                        <textarea
                          className="w-full border rounded px-3 py-2 dark:bg-gray-700"
                          rows={6}
                          placeholder="Décrivez votre service"
                          value={createData.description}
                          onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">Annuler</button>
                      <button type="submit" className="px-4 py-2 rounded bg-primary-600 hover:bg-primary-700 text-white">{modalMode === 'edit' ? 'Enregistrer' : 'Créer'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {userServices.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400">Aucun service joueur pour le moment.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userServices.map((s) => {
              const isEditing = false
              return (
                <div key={s.id} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md flex flex-col">
                  {!isEditing ? (
                    <>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                        <div className="text-primary-600 dark:text-primary-400 font-semibold mb-2">{formatPrice(s.priceCents)}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <div>Créé le: {formatDate(s.createdAt)}</div>
                          <div>Proposé par: {s.user?.username ?? 'Inconnu'}</div>
                        </div>
                      </div>
                      {canManageUserServices && (isAdmin || currentUser?.id === s.userId) && (
                        <div className="mt-4 flex items-center gap-3">
                          <button
                            onClick={() => startEdit(s)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => remove(s.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                          >
                            Supprimer
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <form onSubmit={(e) => submitEdit(e, s.id)} className="flex-1">
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 dark:bg-gray-700 mb-2"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2 dark:bg-gray-700 mb-2"
                        value={editData.price}
                        onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                      />
                      <textarea
                        className="w-full border rounded px-3 py-2 dark:bg-gray-700 mb-3"
                        rows={4}
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      />
                      <div className="flex items-center gap-3">
                        <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition">Enregistrer</button>
                        <button type="button" onClick={cancelEdit} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">Annuler</button>
                      </div>
                    </form>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
