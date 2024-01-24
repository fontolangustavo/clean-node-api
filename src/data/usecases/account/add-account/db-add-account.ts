import type { AddAccount, AddAccountRepository, Hasher, CheckAccountByEmailRepository } from './db-add-account.protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) { }

  async add(accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const exists = await this.checkAccountByEmailRepository.checkByEmail(accountData.email)

    if (!exists) {
      accountData.password = await this.hasher.hash(accountData.password)

      const newAccount = await this.addAccountRepository.add(accountData)

      return await Promise.resolve(newAccount)
    }

    return null
  }
}
