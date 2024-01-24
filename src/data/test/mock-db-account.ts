import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
  CheckAccountByEmailRepository
} from "@/data/protocols/db/account"
import { AccountModel } from "@/domain/models/account"
import { mockAccountModel } from "@/domain/test"

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
      return await Promise.resolve(mockAccountModel())
    }
  }

  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

export const mockCheckAccountByEmailRepository = (): CheckAccountByEmailRepository => {
  class CheckAccountByEmailRepositoryStub implements CheckAccountByEmailRepository {
    async checkByEmail(email: string): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }

  return new CheckAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken(token: string, role?: string): Promise<LoadAccountByTokenRepository.Result | null> {
      return await Promise.resolve(mockAccountModel())
    }
  }

  return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}
