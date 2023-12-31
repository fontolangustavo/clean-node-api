import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('Email validator adapter', () => {
  it('should return false if validator returns false', () => {
    const sut = makeSut()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@email.com')

    expect(isValid).toBe(false)
  })

  it('should return true if validator returns true', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true)
    const isValid = sut.isValid('valid_email@email.com')

    expect(isValid).toBe(true)
  })

  it('should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid('any_email@email.com')

    expect(isEmailSpy).toHaveBeenCalledWith('any_email@email.com')
  })
})
