import { AccountModel } from "@/domain/models/account";
import { Authentication } from "@/domain/usecases/account/authentication";

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'hashed_password'
})

export const mockFakeAuthentication = (): Authentication.Params => ({
  email: 'any_email@email.com',
  password: 'any_password'
})
