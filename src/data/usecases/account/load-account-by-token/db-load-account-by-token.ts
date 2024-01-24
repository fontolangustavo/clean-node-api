
import { Decrypter, LoadAccountByToken, LoadAccountByTokenRepository } from "./db-load-account-by-token.protocols";

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) { }

  async load(accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
    let token: string

    try {
      token = await this.decrypter.decrypt(accessToken)
    } catch (error) {
      return await Promise.resolve(null)
    }

    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (account) {
        return await Promise.resolve(account)
      }
    }

    return await Promise.resolve(null)
  }
}