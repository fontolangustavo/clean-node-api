import { DbAddAccount } from './db-add-account'
import type { Encrypter } from './protocols/encrypter'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return await Promise.resolve('hashed_value')
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()

  return {
    sut: new DbAddAccount(encrypterStub),
    encrypterStub
  }
}

describe('DBAddAccount Usecase', () => {
  test('should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const account = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }

    await sut.add(account)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
