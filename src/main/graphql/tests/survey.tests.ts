import { sign } from 'jsonwebtoken';
import { createTestClient } from 'apollo-server-integration-testing'
import { Collection, ObjectId } from 'mongodb';
import { ApolloServer, ExpressContext, gql } from 'apollo-server-express';
import { Express } from 'express'
import request from 'supertest'

import env from '@/main/config/env';
import { setupApp } from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { makeApolloServer } from './helpers';

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

  describe('Surveys Query', () => {
    const query = `query {
      surveys {
        id
        question
        answers {
          image
          answer
        }
        created_at
        didAnswer
      }
    }`

    test('should return Surveys', async () => {
      await makeFakeSurveys()

      const response = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(response.body.data.surveys.length).toBe(2)
    })

    test('should return AccessDeniedError if no token is provided', async () => {
      await makeFakeSurveys()

      const response = await request(app)
        .post('/graphql')
        .send({ query })

      expect(response.body.data).toBeFalsy()
      expect(response.body.errors[0].message).toBe('Access denied')
    })
  });
});