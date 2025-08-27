export interface User {
  id: number
  username: string
  email: string | null
  role: 'invité' | 'joueur' | 'admin' | 'instanceAdmin'
  instanceId?: number | null
  instance?: Instance
  createdAt: string
  updatedAt: string | null
}

export interface Project {
  id: number
  userId: number
  instanceId: number
  name: string
  description: string
  dimension: 'overworld' | 'nether' | 'end'
  x: number
  y: number
  z: number
  complementary_x: number | null
  complementary_y: number | null
  complementary_z: number | null
  tagId: number
  dynmapUrl: string | null
  status: 'en_cours' | 'termine'
  createdAt: string
  updatedAt: string | null
  user?: User
  tag?: Tag
  instance?: Instance
  collaborators?: User[]
  isVisited?: boolean
  isPrivate?: boolean
  averageRating?: number | null
  userRating?: number | null
}

export interface Tag {
  id: number
  label: string
}

export interface Instance {
  id: number
  name: string
  image?: string | null
  createdAt: string
  updatedAt: string | null
  descriptions?: InstanceDescription[]
  projects?: Project[]
  users?: User[]
  service?: InstanceService | null
}

export interface InstanceDescription {
  id: number
  instanceId: number
  title: string
  content: string
  createdAt: string
  updatedAt: string | null
  instance?: Instance
}

export interface InstanceService {
  id: number
  instanceId: number
  title: string
  priceCents: number
  description: string
  createdAt: string
  updatedAt: string | null
}

export interface UserService {
  id: number
  userId: number
  title: string
  priceCents: number
  description: string | null
  createdAt: string
  updatedAt: string | null
  user?: User
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
