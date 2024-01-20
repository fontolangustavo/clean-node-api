import type { AccountModel } from '../../models/account'

export interface AddAccountParams {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add: (account: AddAccountParams) => Promise<AccountModel | null>
}

export namespace AddAccount {
  export type Params = {
    name: string
    email: string
    password: string
  }

  export type Result = AccountModel
}
