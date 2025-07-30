import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany, hasMany, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Tag from './tag.js'
import Instance from './instance.js'
import UserVisitedProject from './user_visited_project.js'

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

  @hasMany(() => UserVisitedProject)
  declare visitedByUsers: HasMany<typeof UserVisitedProject>

  // This property is not in the database but is added dynamically by controllers
  // Adding it here with serializeAs ensures it's always included in the JSON representation
  @computed({ serializeAs: 'isVisited' })
  declare isVisited: boolean | null

  /**
   * Set the isVisited property on an array of projects for a specific user
   * This method should be used by controllers to ensure consistent handling of the isVisited property
   */
  static async setVisitedStatus(projects: Project | Project[], userId: number): Promise<void> {
    if (!Array.isArray(projects)) {
      projects = [projects]
    }

    if (projects.length === 0) {
      return
    }

    // Get all visit records for the user
    const visitRecords = await UserVisitedProject.query().where('userId', userId).exec()

    // Create a map of project IDs to their visited status
    const visitedProjectMap = new Map(
      visitRecords.map((visit) => [visit.projectId, visit.isVisited])
    )

    // Set isVisited property on each project
    projects.forEach((project) => {
      project.isVisited = visitedProjectMap.has(project.id)
        ? visitedProjectMap.get(project.id)
        : false
    })
  }
}
