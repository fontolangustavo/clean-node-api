import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { type AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { type AccountModel } from '@/domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { ObjectId } from 'mongodb'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { CheckAccountByEmailRepository } from '@/data/protocols/db/account'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add(accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)

    const account = Object.assign(accountData, { id: result.insertedId.toString() })

    return await Promise.resolve(account)
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })

    return account && MongoHelper.map(account)
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.updateOne({
      _id: new ObjectId(id)
    }, {
      $set: {
        accessToken: token
      }
    })
  }

  async checkByEmail(email: string): Promise<CheckAccountByEmailRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email }, {
      projection: {
        _id: 1
      }
    })

    return account !== null
  }

  async loadByToken(token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [
        {
          role
        },
        {
          role: 'admin'
        }
      ]
    })

    return account && MongoHelper.map(account)
  }


}
