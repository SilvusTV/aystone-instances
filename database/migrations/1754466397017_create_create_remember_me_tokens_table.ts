import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'remember_me_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      // The user or entity for whom the token is generated
      table.integer('tokenable_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      
      // Token hash is used to verify the token shared with the user
      table.string('hash').notNullable()
      
      // Timestamp at which the token will expire
      table.timestamp('expires_at').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}