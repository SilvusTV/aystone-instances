import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('instance_id').unsigned().references('id').inTable('instances').after('user_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('instance_id')
    })
  }
}
