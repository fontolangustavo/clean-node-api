import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors';
import { LoadAccountByToken, HttpRequest } from './auth-middleware-protocols'
import { AuthMiddleware } from './auth-middleware';
import { mockAccountModel } from '@/domain/test';
import { mockLoadAccountByToken } from '@/presentation/test';

const makeFakeRequest = (): AuthMiddleware.Request => ({
  accessToken: 'any_token'
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return {
    sut,
    loadAccountByTokenStub
  }
}

const role = 'any_role'

describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  });

  test('should rcall LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut(role)

    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(makeFakeRequest())

    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  });

  test('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut(role)

    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null))

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  });

  test('should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut(role)

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok({ account: mockAccountModel() }))
  });

  test('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut(role)

    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  });
});