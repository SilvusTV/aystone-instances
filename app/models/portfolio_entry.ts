import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export type PortfolioEntryKind = 'project' | 'event' | 'experience' | 'skill'

export default class PortfolioEntry extends BaseModel {
  static table = 'portfolio_entries'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare kind: PortfolioEntryKind

  @column()
  declare title: string

  @column()
  declare summary: string

  @column()
  declare highlighted: boolean

  @column()
  declare startYear: number | null

  @column()
  declare endYear: number | null

  @column()
  declare technologies: string[]

  @column()
  declare context: string | null

  @column()
  declare metric: string | null

  @column()
  declare order: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
