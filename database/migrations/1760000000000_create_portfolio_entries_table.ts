import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'portfolio_entries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .enu('kind', ['project', 'event', 'experience', 'skill'], {
          useNative: true,
          enumName: 'portfolio_entry_kind',
          existingType: false,
        })
        .notNullable()
      table.string('title', 180).notNullable()
      table.text('summary').notNullable()
      table.boolean('highlighted').notNullable().defaultTo(false)
      table.integer('start_year').nullable()
      table.integer('end_year').nullable()
      table.specificType('technologies', 'text[]').notNullable().defaultTo('{}')
      table.string('context', 255).nullable()
      table.string('metric', 255).nullable()
      table.integer('order').notNullable().defaultTo(0)
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())

      table.index(['kind'])
      table.index(['highlighted'])
      table.index(['order'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS portfolio_entry_kind')
  }
}
