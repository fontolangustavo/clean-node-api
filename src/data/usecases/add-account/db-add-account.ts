import type { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher } from './db-add-account.protocols'

export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher
  private readonly addAccountRepository: AddAccountRepository

  constructor(hasher: Hasher, addAccountRepository: AddAccountRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    accountData.password = await this.hasher.hash(accountData.password)

    const account = await this.addAccountRepository.add(accountData)

    return await Promise.resolve(account)
  }
}
