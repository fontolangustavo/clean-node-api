import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    created_at: new Date(),
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      },
      {
        answer: 'other_answer'
      }
    ]
  })

  return MongoHelper.map(await surveyCollection.findOne<SurveyModel>({ _id: res.insertedId }))
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  })

  return MongoHelper.map(await accountCollection.findOne<AccountModel>({ _id: res.insertedId }))
}

describe('Survey Result Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    test('should add a survey result if its new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()

      const sut = makeSut()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        created_at: new Date()
      })

      console.log(surveyResult, account, survey)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })
  })
})
