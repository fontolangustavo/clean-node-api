import request from 'supertest'
import { setupApp } from '../config/app'
import { Express } from 'express'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import { Collection, ObjectId } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '../config/env';

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

describe('Surey Routes', () => {

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

  describe('POST /surveys', () => {
    test('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/v1/surveys')
        .send({
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer'
            },
            {
              answer: 'any_answer_2'
            }
          ]
        })
        .expect(403)
    });

    test('should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeFakeAccount('admin')

      await request(app)
        .post('/api/v1/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer'
            },
            {
              answer: 'any_answer_2'
            }
          ]
        })
        .expect(204)
    });
  });

  describe('GET /surveys', () => {
    test('should return 403 on load survey without accessToken', async () => {
      await request(app)
        .get('/api/v1/surveys')
        .expect(403)
    });

    test('should return 200 on load surveys with valid accessToken', async () => {
      await makeFakeSurveys()
      const accessToken = await makeFakeAccount()

      await request(app)
        .get('/api/v1/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    });
  });
});
