import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
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
      const sut = makeSut()
      await surveyCollection.insertMany([
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
        }])

      const surveys = await sut.load()

      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })

    test('should load empty list', async () => {
      const sut = makeSut()

      const surveys = await sut.load()

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

      console.log(res.insertedId.toString())
      const id = res.insertedId.toString()
      const survey = await sut.loadById(id)

      expect(survey).toBeTruthy()
    })

  });

})
