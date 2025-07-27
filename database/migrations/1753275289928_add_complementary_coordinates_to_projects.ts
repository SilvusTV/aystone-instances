import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('complementary_x').nullable()
      table.integer('complementary_y').nullable()
      table.integer('complementary_z').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('complementary_x')
      table.dropColumn('complementary_y')
      table.dropColumn('complementary_z')
    })
  }
}
