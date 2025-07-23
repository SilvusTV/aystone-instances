import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Tag from './tag.js'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

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
}