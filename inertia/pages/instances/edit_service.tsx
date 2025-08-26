import React, { useEffect, useState } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import Layout from '@/components/layout'
import { Instance, InstanceService, PageProps } from '@/types'

interface EditServicePageProps extends PageProps {
  instance: Instance & { service?: InstanceService | null }
  canEdit: boolean
}

export default function EditInstanceServicePage({ instance, canEdit, flash }: EditServicePageProps) {
  const existing = instance.service || null
  const [isFree, setIsFree] = useState(!existing || existing.priceCents === 0)

  // Dynamic editor pieces loaded only on client
  const [EditorComponent, setEditorComponent] = useState<React.ComponentType<any> | null>(null)
  const [editorLibs, setEditorLibs] = useState<{
    EditorState: any
    ContentState: any
    convertToRaw: any
    htmlToDraft: any
    draftToHtml: any
  } | null>(null)
  const [editorState, setEditorState] = useState<any>(null)

  const { data, setData, post, processing, errors, transform } = useForm({
    title: existing?.title || '',
    price: existing ? (existing.priceCents / 100).toString() : '',
    priceCents: existing?.priceCents ?? 0,
    description: existing?.description || '',
  })

  // Load editor libs on client only
  useEffect(() => {
    if (typeof window === 'undefined') return
    let mounted = true
    ;(async () => {
      try {
        // Polyfill Node-style globals expected by fbjs/draft-js when running in the browser
        // Ensure `global` exists (alias to globalThis/window)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof (globalThis as any).global === 'undefined') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(globalThis as any).global = globalThis as any
        }
        // Optional: minimal process.env for libraries that check it
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
        ])
        // CSS side-effect import
        await import('react-draft-wysiwyg/dist/react-draft-wysiwyg.css')

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

        // Initialize editor state from existing HTML
        const html = existing?.description || ''
        if (html) {
          const blocksFromHtml = libs.htmlToDraft(html)
          const contentState = libs.ContentState.createFromBlockArray(
            blocksFromHtml.contentBlocks,
            blocksFromHtml.entityMap
          )
          setEditorState(libs.EditorState.createWithContent(contentState))
          // Ensure form has HTML
          setData('description', html)
        } else {
          setEditorState(libs.EditorState.createEmpty())
          const raw = libs.convertToRaw(libs.EditorState.createEmpty().getCurrentContent())
          const initHtml = libs.draftToHtml(raw)
          setData('description', initHtml)
        }
      } catch (e) {
        // If loading fails, leave editor null; users will still be able to submit other fields
        console.error('Failed to load rich editor libs:', e)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const onEditorStateChange = (state: any) => {
    setEditorState(state)
    if (!editorLibs) return
    const raw = editorLibs.convertToRaw(state.getCurrentContent())
    const html = editorLibs.draftToHtml(raw)
    setData('description', html)
  }

  const uploadImage = async (file: File): Promise<{ data: { link: string } }> => {
    const formData = new FormData()
    formData.append('image', file)
    const res = await fetch(`/api/instances/${instance.name}/service/upload-image`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      throw new Error("Échec du téléversement de l'image")
    }
    const json = await res.json()
    const url = json.url as string
    return { data: { link: url } }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = (data.price || '').toString().replace(/\s+/g, '').replace(',', '.')
    const euros = Number(normalized || '0')
    const computedPriceCents = isFree ? 0 : Math.max(0, Math.round(euros * 100))

    // Ensure latest HTML is saved before post if editor is ready
    if (editorLibs && editorState) {
      const raw = editorLibs.convertToRaw(editorState.getCurrentContent())
      const html = editorLibs.draftToHtml(raw)
      setData('description', html)
    }

    transform((fd) => ({
      ...fd,
      priceCents: computedPriceCents,
      price: isFree ? '' : fd.price,
    }))

    post(`/instances/${instance.name}/service`)
  }

  return (
    <Layout>
      <Head title={`Modifier le service - ${instance.name}`} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Modifier le service de l'instance: {instance.name}</h1>
        <div className="flex space-x-2 mb-4">
          <Link href={`/instances/${instance.name}/service`} className="text-primary-600 hover:text-primary-800 dark:text-primary-400">
            &larr; Retour au service
          </Link>
        </div>
      </div>

      {!canEdit ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Vous n'avez pas les droits pour modifier le service de cette instance.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          {flash?.success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{flash.success}</div>
          )}
          {flash?.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{flash.error}</div>
          )}

          <h2 className="text-xl font-bold mb-4">Configurer le service</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block mb-2">Titre</label>
              <input
                id="title"
                type="text"
                className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${errors.title ? 'border-red-500' : ''}`}
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                required
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input id="isFree" type="checkbox" checked={isFree} onChange={(e) => { const checked = e.target.checked; setIsFree(checked); if (checked) setData('price', ''); }} />
                <label htmlFor="isFree">Gratuit</label>
              </div>
              {!isFree && (
                <div>
                  <label htmlFor="price" className="block mb-1">Prix (Unité)</label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    className={`p-2 border rounded dark:bg-gray-700 dark:border-gray-600 ${errors.price ? 'border-red-500' : ''}`}
                    value={data.price}
                    onChange={(e) => {
                      const val = e.target.value
                      setData('price', val)
                      const euros = Number((val || '').toString().replace(/\s+/g, '').replace(',', '.'))
                      if (!isNaN(euros) && euros > 0) setIsFree(false)
                    }}
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>
              )}
            </div>

            <div className="mb-2">
              <label className="block mb-2">Description</label>
              <div className="border rounded dark:border-gray-600 bg-white dark:bg-gray-700">
                {EditorComponent && editorState ? (
                  <EditorComponent
                    editorState={editorState}
                    onEditorStateChange={onEditorStateChange}
                    toolbar={{
                      options: ['inline', 'colorPicker', 'list', 'link', 'image', 'history'],
                      inline: { options: ['bold', 'italic', 'underline'] },
                      colorPicker: {},
                      link: { defaultTargetOption: '_blank', showOpenOptionOnHover: true },
                      image: {
                        uploadCallback: uploadImage,
                        previewImage: true,
                        alt: { present: true, mandatory: false },
                        defaultSize: { height: 'auto', width: 'auto' },
                      },
                    }}
                    editorClassName="min-h-[200px] px-3 py-2 dark:text-gray-100"
                    toolbarClassName="border-b dark:border-gray-600"
                    wrapperClassName="ay2-rich-editor"
                  />
                ) : (
                  <div className="min-h-[200px] px-3 py-2 text-sm text-gray-500 dark:text-gray-300 flex items-center">
                    Chargement de l'éditeur...
                  </div>
                )}
              </div>
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              <p className="text-gray-500 text-sm mt-1">Vous pouvez utiliser le gras, italique, couleurs, liens et images.</p>
            </div>

            <button type="submit" disabled={processing} className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition">
              {processing ? 'Enregistrement...' : 'Enregistrer le service'}
            </button>
          </form>
        </div>
      )}
    </Layout>
  )
}
