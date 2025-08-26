import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'instance_services'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('instance_id')
        .unsigned()
        .references('id')
        .inTable('instances')
        .onDelete('CASCADE')
        .unique()
      table.string('title').notNullable()
      table.integer('price_cents').notNullable().defaultTo(0)
      table.text('description').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
