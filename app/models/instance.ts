import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Project from './project.js'
import InstanceDescription from './instance_description.js'
import User from './user.js'
import InstanceService from './instance_service.js'

export default class Instance extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare image: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Project)
  declare projects: HasMany<typeof Project>

  @hasMany(() => InstanceDescription)
  declare descriptions: HasMany<typeof InstanceDescription>

  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @hasOne(() => InstanceService)
  declare service: HasOne<typeof InstanceService>
}
