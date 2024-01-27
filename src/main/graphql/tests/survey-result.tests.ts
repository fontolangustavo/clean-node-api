import { sign } from 'jsonwebtoken';
import { Express } from 'express'
import { Collection, InsertManyResult, ObjectId } from 'mongodb';
import { gql } from 'apollo-server-express';
import request from 'supertest'

import env from '@/main/config/env';
import { setupApp } from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers';

let surveyCollection: Collection
let accountCollection: Collection
let app: Express

const makeFakeAccount = async (role?: string): Promise<string> => {
  let account = {
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'any_password',
  }

  if (role) {
    account = Object.assign(account, { role })
  }

  const res = await accountCollection.insertOne(account)

  const id = res.insertedId.toHexString()
  const accessToken = sign({ id }, env.jwtSecret)

  await accountCollection.updateOne({
    _id: new ObjectId(id)
  }, {
    $set: {
      accessToken
    }
  })

  return accessToken
}

const makeFakeSurveys = async (): Promise<InsertManyResult> => {
  return await surveyCollection.insertMany([
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
}

describe('SurveyResult GraphQL', async () => {
  const accessToken = await makeFakeAccount()

  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('SurveyResult Query', () => {
    const surveyResultQuery = gql`
      query surveyResult ($surveyId: String!) {
        surveyResult (surveyId: $surveyId) {
          questions
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          created_at
        }
      }
    `

    test('should return SurveyResult', async () => {
      const surveys = await makeFakeSurveys()
      const surveyId = surveys.insertedIds[0]

      const query = `query {
        surveyResult (surveyId: "${surveyId}") {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          created_at
        }
      }`

      const response = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(response.body.data.surveyResult.question).toBe('any_question')
    })

    test('should return AccessDeniedError if no token is provided', async () => {
      const surveys = await makeFakeSurveys()
      const surveyId = surveys.insertedIds[0]

      const query = `query {
        surveyResult (surveyId: "${surveyId}") {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          created_at
        }
      }`

      const response = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(response.body.data).toBeFalsy()
      expect(response.body.errors[0].message).toBe('Access denied')
    })
  });

  describe('SaveSurveyResult Mutation', () => {
    test('should return SurveyResult', async () => {
      const surveys = await makeFakeSurveys()
      const surveyId = surveys.insertedIds[0]

      const query = `mutation {
        saveSurveyResult (surveyId: "${surveyId}", answer: "Answer 1") {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          created_at
        }
      }`

      const response = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(response.body.data.saveSurveyResult.question).toBe('any_question')
      expect(response.body.data.saveSurveyResult.answers).toEqual([
        {
          answer: 'any_answer',
          count: 1,
          percent: 100,
          isCurrentAccountAnswer: true
        },
        {
          answer: 'other_answer',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }
      ])
    })

    test('should return AccessDeniedError if no token is provided', async () => {
      const surveys = await makeFakeSurveys()
      const surveyId = surveys.insertedIds[0]

      const query = `mutation {
        saveSurveyResult (surveyId: "${surveyId}", answer: "Answer 1") {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          created_at
        }
      }`

      const response = await request(app)
        .post('/graphql')
        .send({ query })

      expect(response.body.data).toBeFalsy()
      expect(response.body.errors[0].message).toBe('Access denied')
    })
  });
});
