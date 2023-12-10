import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import { Collection, ObjectId } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '../config/env';

let surveyCollection: Collection
let accountCollection: Collection

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

describe('Survey Result Routes', () => {

  beforeAll(async () => {
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

  describe('PUT /surveys/:surveyId/results', () => {
    test('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .put('/api/v1/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    });
  });
});
