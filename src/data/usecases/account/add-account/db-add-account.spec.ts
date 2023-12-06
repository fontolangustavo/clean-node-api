import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { DbAddAccount } from './db-add-account'
import type { AddAccountRepository, AccountModel, AddAccountModel, Hasher } from './db-add-account.protocols'

const makeHasher = (): Hasher => {
  class HasherStub {
    async hash(value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }

  return new HasherStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel | null> {
      return Promise.resolve(null)
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'hashed_password'
      }

      return await Promise.resolve(fakeAccount)
    }
  }

  return new AddAccountRepositoryStub()
}

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()

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
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }

    await sut.add(account)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('should throw if hasher throws', async () => {
    const { sut, hasherStub } = makeSut()

    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))

    const account = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }

    const promise = sut.add(account)

    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const account = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }

    await sut.add(account)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'hashed_password'
    })
  })

  test('should throw if add account repository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))

    const account = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }

    const promise = sut.add(account)

    await expect(promise).rejects.toThrow()
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()

    const account = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }

    const accountData = await sut.add(account)

    expect(accountData).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'hashed_password'
    })
  })

  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.add({
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    })

    expect(loadSpy).toHaveBeenCalledWith('valid_email@email.com')
  });

  test('should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const account = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'hashed_password'
    }))


    const accountData = await sut.add(account)

    expect(accountData).toBeNull()
  })
})
