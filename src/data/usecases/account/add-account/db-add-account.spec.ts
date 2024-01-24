import { mockAccountModel } from '@/domain/test'
import { mockHasher } from '@/data/test'
import { mockAddAccountRepository, mockCheckAccountByEmailRepository } from '@/data/test/mock-db-account'
import type { AddAccountRepository, CheckAccountByEmailRepository, Hasher } from './db-add-account.protocols'
import { DbAddAccount } from './db-add-account'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  checkAccountByEmailRepositoryStub: CheckAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const checkAccountByEmailRepositoryStub = mockCheckAccountByEmailRepository()

  jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail').mockReturnValue(Promise.resolve(false))

  return {
    sut: new DbAddAccount(hasherStub, addAccountRepositoryStub, checkAccountByEmailRepositoryStub),
    hasherStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepositoryStub
  }
}

describe('DBAddAccount Usecase', () => {
  test('should call hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const encryptSpy = jest.spyOn(hasherStub, 'hash')

    const account = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    }

    await sut.add(account)

    expect(encryptSpy).toHaveBeenCalledWith('any_password')
  })

  test('should throw if hasher throws', async () => {
    const { sut, hasherStub } = makeSut()

    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))

    const account = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    }

    const promise = sut.add(account)

    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const account = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    }

    await sut.add(account)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'hashed_password'
    })
  })

  test('should throw if add account repository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))

    const account = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    }

    const promise = sut.add(account)

    await expect(promise).rejects.toThrow()
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()

    const account = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    }

    const accountData = await sut.add(account)

    expect(accountData).toEqual(mockAccountModel())
  })

  test('should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()

    const checkSpy = jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail')

    await sut.add({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })

    expect(checkSpy).toHaveBeenCalledWith('any_email@email.com')
  });

  test('should return null if CheckAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()

    const account = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    }

    jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail').mockReturnValueOnce(Promise.resolve(true))

    const accountData = await sut.add(account)

    expect(accountData).toBeNull()
  })
})
