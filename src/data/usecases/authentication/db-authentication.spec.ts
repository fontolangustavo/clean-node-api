import { AuthenticationModel } from "../../../domain/usecases/authentication";
import { AccountModel } from "../../../domain/models/account";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";
import { TokenGenerator } from "../../../data/protocols/criptography/token-generator";

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'hashed_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({

  email: 'any_email@email.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount())
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }

  return new HashComparerStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }

  return new TokenGeneratorStub()
}

interface SutTypes {
  sut: DbAuthentication,
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer,
  tokenGeneratorStub: TokenGenerator
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub
  )

  return {
    sut,
    hashComparerStub,
    loadAccountByEmailRepositoryStub,
    tokenGeneratorStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())

    expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
  });

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  });

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBeNull()
  });

  test('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()

    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  });

  test('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  });

  test('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBeNull()
  });

  test('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthentication())

    expect(generateSpy).toHaveBeenCalledWith('any_id')
  });

  test('should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  });

});