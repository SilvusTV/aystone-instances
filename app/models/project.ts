import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Tag from './tag.js'
import Instance from './instance.js'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare instanceId: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare dimension: 'overworld' | 'nether' | 'end'

  @column()
  declare x: number

  @column()
  declare y: number

  @column()
  declare z: number

  @column()
  declare complementary_x: number | null

  @column()
  declare complementary_y: number | null

  @column()
  declare complementary_z: number | null

  @column()
  declare tagId: number

  @column()
  declare dynmapUrl: string | null

  @column()
  declare status: 'en_cours' | 'termine'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Tag)
  declare tag: BelongsTo<typeof Tag>

  @belongsTo(() => Instance)
  declare instance: BelongsTo<typeof Instance>

  @manyToMany(() => User, {
    pivotTable: 'project_collaborators',
    pivotForeignKey: 'project_id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare collaborators: ManyToMany<typeof User>
}
