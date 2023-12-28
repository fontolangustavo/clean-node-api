import { mockAccountModel } from '@/domain/test'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { DbAddAccount } from './db-add-account'
import type { AddAccountRepository, AccountModel, Hasher } from './db-add-account.protocols'
import { mockHasher } from '@/data/test'
import { mockAddAccountRepository } from '@/data/test/mock-db-account'


const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel | null> {
      return Promise.resolve(null)
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()

  return {
    sut: new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub),
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
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

  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.add({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })

    expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
  });

  test('should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const account = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    }

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(mockAccountModel()))


    const accountData = await sut.add(account)

    expect(accountData).toBeNull()
  })
})
