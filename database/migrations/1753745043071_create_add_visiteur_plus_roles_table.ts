import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    // Drop the existing check constraint
    await this.db.rawQuery(`
      ALTER TABLE ${this.tableName} DROP CONSTRAINT users_role_check
    `)

    // Add a new check constraint with the updated enum values including visiteurPlus
    await this.db.rawQuery(`
      ALTER TABLE ${this.tableName} ADD CONSTRAINT users_role_check 
      CHECK (role IN ('invité', 'joueur', 'admin', 'instanceAdmin', 'visiteurPlus'))
    `)
  }

  async down() {
    // Revert to the previous check constraint
    await this.db.rawQuery(`
      ALTER TABLE ${this.tableName} DROP CONSTRAINT users_role_check
    `)

    await this.db.rawQuery(`
      ALTER TABLE ${this.tableName} ADD CONSTRAINT users_role_check 
      CHECK (role IN ('invité', 'joueur', 'admin', 'instanceAdmin'))
    `)
  }
}