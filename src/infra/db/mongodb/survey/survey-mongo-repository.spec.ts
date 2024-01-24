import MockDate from 'mockdate'
import FakeObjectId from 'bson-objectid'

import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { AccountModel } from '@/domain/models/account'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  })

  const account = await accountCollection.findOne<AccountModel>({ _id: res.insertedId })

  return MongoHelper.map(account)
}

describe('Survey Mongo Repository', () => {
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

  describe('add()', () => {
    test('should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add({
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

      const survey = await surveyCollection.findOne({ question: 'any_question' })

      expect(survey).toBeTruthy()
    })

  });

  describe('load()', () => {
    test('should load surveys on success', async () => {
      const account = await makeAccount()
      const sut = makeSut()
      const result = await surveyCollection.insertMany([
        {
          question: 'any_question',
          created_at: new Date(),
          answers: [
            {
              answer: 'any_answer'
            },
          ]
        },
        {
          question: 'other_question',
          created_at: new Date(),
          answers: [
            {
              answer: 'other_answer'
            },
          ]
        }]
      )

      const surveyId = result.insertedIds[0]

      await surveyResultCollection.insertOne(
        {
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(account.id),
          answer: 'any_answer',
          created_at: new Date()
        }
      )

      const surveys = await sut.load(account.id)

      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe('other_question')
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('should load empty list', async () => {
      const account = await makeAccount()
      const sut = makeSut()

      const surveys = await sut.load(account.id)

      expect(surveys.length).toBe(0)
    })

  });

  describe('loadById()', () => {
    test('should load survey by id on success', async () => {
      const sut = makeSut()

      const res = await surveyCollection.insertOne(
        {
          question: 'any_question',
          answers: [
            {
              answer: 'any_answer'
            },
          ],
          created_at: new Date()
        }
      )

      const id = res.insertedId.toString()
      const survey = await sut.loadById(id)

      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  });


  describe('checkById()', () => {
    test('should return true if survey exists', async () => {
      const sut = makeSut()

      const res = await surveyCollection.insertOne(
        {
          question: 'any_question',
          answers: [
            {
              answer: 'any_answer'
            },
          ],
          created_at: new Date()
        }
      )

      const id = res.insertedId.toString()
      const exists = await sut.checkById(id)

      expect(exists).toBeTruthy()
    })

    test('should return false if survey not exists', async () => {
      const sut = makeSut()

      const exists = await sut.checkById(FakeObjectId("54495ad94c934721ede76d90").toHexString())

      expect(exists).toBeFalsy()
    })
  });
})
