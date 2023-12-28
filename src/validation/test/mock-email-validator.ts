import { EmailValidator } from '@/validation/protocols/email-validator'

export const mockEmailValidator = (): EmailValidator => {
  class EmailValidator implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidator()
}
