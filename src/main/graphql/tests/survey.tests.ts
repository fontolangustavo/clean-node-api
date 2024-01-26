
import request from 'supertest'
import { sign } from 'jsonwebtoken';
import { createTestClient } from 'apollo-server-integration-testing'
import { Collection, ObjectId } from 'mongodb';
import { ApolloServer, gql } from 'apollo-server-express';

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

  const id = res.insertedId.toString()
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

const makeFakeSurveys = async (): Promise<void> => {
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
}

describe('Surveys GraphQL', async () => {
  const accessToken = await makeFakeAccount()

  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Surveys Query', () => {
    const surveysQuery = gql`
      query surveys {
        surveys {
          id
          questions
          answers {
            image
            answer
          }
          created_at
          didAnswers
        }
      }
    `

    test('should return Surveys', async () => {
      makeFakeSurveys()

      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })

      const response: any = await query(surveysQuery)

      expect(response.surveys.length).toBe(2)
    })
  });
});