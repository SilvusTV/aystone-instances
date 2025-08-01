import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Instance from './instance.js'

export default class InstanceDescription extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare instanceId: number

  @column()
  declare title: string

  @column()
  declare content: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Instance)
  declare instance: BelongsTo<typeof Instance>
}
