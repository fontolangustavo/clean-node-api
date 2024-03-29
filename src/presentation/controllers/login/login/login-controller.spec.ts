import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper';
import { Authentication, Validation } from './login-controller-protocols'
import { MissingParamError } from '@/presentation/errors';
import { LoginController } from './login-controller';
import { mockAuthentication } from '@/presentation/test';
import { mockValidation } from '@/presentation/test';

type SutTypes = {
  sut: LoginController,
  authenticationStub: Authentication,
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication()
  const validationStub = mockValidation()

  const sut = new LoginController(authenticationStub, validationStub)

  return {
    sut,
    authenticationStub,
    validationStub,
  }
}

describe('Login Controller', () => {
  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const request = {
      email: 'any_email@email.com',
      password: 'any_password'
    }

    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@email.com', password: 'any_password'
    })

  });

  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))

    const request = {
      email: 'any_email@email.com',
      password: 'any_password'
    }

    const httpResponse = await sut.handle(request)

    expect(httpResponse).toEqual(unauthorized())
  });

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()))

    const request = {
      email: 'any_email@email.com',
      password: 'any_password'
    }

    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  });

  test('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const request = {
      email: 'any_email@email.com',
      password: 'any_password'
    }

    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok({
      accessToken: 'any_token',
      name: 'any_name'
    }))
  });

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = {
      name: 'any_name',
      email: 'valid_email@email.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }

    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const request = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
      passwordConfirmation: 'valid_password'
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
});