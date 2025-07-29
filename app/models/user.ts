import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Project from './project.js'
import Config from './config.js'
import Instance from './instance.js'
import UserVisitedProject from './user_visited_project.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['username', 'email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email: string | null

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: 'invité' | 'joueur' | 'admin' | 'instanceAdmin' | 'visiteurPlus'

  @column()
  declare instanceId: number | null

  @column()
  declare resetToken: string | null

  @column.dateTime()
  declare resetTokenExpiresAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Project)
  declare projects: HasMany<typeof Project>

  @hasMany(() => Config)
  declare configs: HasMany<typeof Config>

  @belongsTo(() => Instance)
  declare instance: BelongsTo<typeof Instance>

  @manyToMany(() => Project, {
    pivotTable: 'project_collaborators',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'project_id',
  })
  declare collaboratedProjects: ManyToMany<typeof Project>

  @hasMany(() => UserVisitedProject)
  declare visitedProjects: HasMany<typeof UserVisitedProject>
}
