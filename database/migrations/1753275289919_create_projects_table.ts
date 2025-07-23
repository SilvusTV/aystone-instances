import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('name').notNullable()
      table.text('description').notNullable()
      table.enum('dimension', ['overworld', 'nether', 'end']).notNullable()
      table.integer('x').notNullable()
      table.integer('y').notNullable()
      table.integer('z').notNullable()
      table.integer('tag_id').unsigned().references('id').inTable('tags')
      table.string('dynmap_url').nullable()
      table.enum('status', ['en_cours', 'termine']).defaultTo('en_cours').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}