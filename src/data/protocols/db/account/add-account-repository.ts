import type { AddAccountModel } from '@/domain/usecases/account/add-account'
import type { AccountModel } from '@/domain/models/account'

export interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
