import MockDate from 'mockdate'
import { Collection, ObjectId } from 'mongodb'

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
      },
      {
        answer: 'another_answer'
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
    MockDate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
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

      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        created_at: new Date()
      })

      const surveyResult = await surveyResultCollection.findOne({
        surveyId: survey.id,
        accountId: account.id,

      })

      expect(surveyResult).toBeTruthy()
    })

    test('should update survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()

      MongoHelper.map(await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        created_at: new Date()
      }))

      const sut = makeSut()

      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        created_at: new Date()
      })

      const surveyResult = await surveyResultCollection
        .find({
          surveyId: survey.id,
          accountId: account.id,
        })
        .toArray()

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })
  })

  describe('loadBySurveyId()', () => {
    test('should load survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()

      MongoHelper.map(await surveyResultCollection.insertMany(
        [
          {
            surveyId: new ObjectId(survey.id),
            accountId: new ObjectId(account.id),
            answer: survey.answers[0].answer,
            created_at: new Date()
          },
          {
            surveyId: new ObjectId(survey.id),
            accountId: new ObjectId(account.id),
            answer: survey.answers[0].answer,
            created_at: new Date()
          },
          {
            surveyId: new ObjectId(survey.id),
            accountId: new ObjectId(account.id),
            answer: survey.answers[1].answer,
            created_at: new Date()
          },
          {
            surveyId: new ObjectId(survey.id),
            accountId: new ObjectId(account.id),
            answer: survey.answers[1].answer,
            created_at: new Date()
          }
        ]
      ))

      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[1].count).toBe(2)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
    })
  });
})
