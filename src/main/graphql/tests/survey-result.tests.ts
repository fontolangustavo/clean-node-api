
import request from 'supertest'
import { sign } from 'jsonwebtoken';
import { createTestClient } from 'apollo-server-integration-testing'
import { Collection, InsertManyResult, ObjectId } from 'mongodb';
import { ApolloServer, ExpressContext, gql } from 'apollo-server-express';

import env from '@/main/config/env';
import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { makeApolloServer } from './helpers';

let surveyCollection: Collection
let accountCollection: Collection
let apolloServer: ApolloServer

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
    apolloServer = makeApolloServer()
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

      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })

      const response: any = await query(surveyResultQuery, {
        variables: {
          surveyId: surveyId.toString()
        }
      })

      expect(response.data.surveyResult.question).toBe('any_question')
    })

    test('should return AccessDeniedError if no token is provided', async () => {
      const surveys = await makeFakeSurveys()
      const surveyId = surveys.insertedIds[0]

      const { query } = createTestClient({ apolloServer: apolloServer })

      const response: any = await query(surveyResultQuery, {
        variables: {
          surveyId: surveyId.toString()
        }
      })

      expect(response.data).toBeFalsy()
      expect(response.errors[0].message).toBe('Access denied')
    })
  });

  describe('SaveSurveyResult Mutation', () => {
    const saveSurveyResultMutation = gql`
      mutation saveSurveyResult ($surveyId: String!, $answer: String!) {
        saveSurveyResult (surveyId: $surveyId, answer: $answer) {
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

      const { mutate } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })

      const response: any = await mutate(saveSurveyResultMutation, {
        variables: {
          surveyId: surveyId.toString(),
          answer: 'any_answer'
        }
      })

      expect(response.data.saveSurveyResult.question).toBe('any_question')
      expect(response.data.saveSurveyResult.answers).toEqual([
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

      const { mutate } = createTestClient({ apolloServer: apolloServer })

      const response: any = await mutate(saveSurveyResultMutation, {
        variables: {
          surveyId: surveyId.toString(),
          answer: 'any_answer'
        }
      })

      expect(response.data).toBeFalsy()
      expect(response.errors[0].message).toBe('Access denied')
    })
  });
});
