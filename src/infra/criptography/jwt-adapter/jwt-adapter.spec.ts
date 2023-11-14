import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> { return Promise.resolve('any_token') }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JWT Adapter', () => {
  test('should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_id')

    expect(signSpy).toHaveBeenCalledWith({
      id: 'any_id'
    }, 'secret')
  });

  test('should return a token on sign success', async () => {
    const sut = makeSut()

    const accessToken = await sut.encrypt('any_id')

    expect(accessToken).toEqual('any_token')
  });

  test('should throw if sign throws', async () => {
    const sut = makeSut()

    jest.spyOn(jwt, 'sign').mockImplementationOnce(async () => await Promise.reject(new Error()))

    const promise = sut.encrypt('any_id')

    expect(promise).rejects.toThrow()
  });
});
