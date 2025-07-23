export interface User {
  id: number
  username: string
  email: string | null
  role: 'invité' | 'joueur' | 'admin'
}

export interface Project {
  id: number
  userId: number
  name: string
  description: string
  dimension: 'overworld' | 'nether' | 'end'
  x: number
  y: number
  z: number
  tagId: number
  dynmapUrl: string | null
  status: 'en_cours' | 'termine'
  createdAt: string
  updatedAt: string | null
  user?: User
  tag?: Tag
}

export interface Tag {
  id: number
  label: string
}

export interface PageProps {
  auth?: {
    user: User | null
  }
  flash?: {
    error?: string
    success?: string
  }
  errors?: Record<string, string>
}
