import { BaseMail } from '@adonisjs/mail'
import env from '#start/env'

export default class PasswordResetMail extends BaseMail {
  from = env.get('MAIL_FROM')
  subject = 'Réinitialisation de votre mot de passe'

  constructor(
    private username: string,
    private resetToken: string,
    private resetUrl: string,
    private email: string
  ) {
    super()
  }

  /**
   * The prepare method is invoked for each message that is about
   * to be sent.
   */
  prepare() {
    this.message.to(this.email).html(`
      <h1>Réinitialisation de votre mot de passe</h1>
      <p>Bonjour ${this.username},</p>
      <p>Vous avez demandé une réinitialisation de votre mot de passe. Veuillez cliquer sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
      <p><a href="${this.resetUrl}">Réinitialiser mon mot de passe</a></p>
      <p>(${this.resetUrl})</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.</p>
      <p>Ce lien expirera dans 1 heure.</p>
    `)
  }
}
