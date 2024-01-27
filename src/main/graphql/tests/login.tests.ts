import { hash } from 'bcrypt';
import { Express } from 'express'
import { Collection } from 'mongodb';
import { gql } from 'apollo-server-express';
import request from 'supertest'

import { setupApp } from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers';

let accountCollection: Collection
let app: Express

describe('Login GraphQL', () => {

  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Login Query', () => {
    const query = `query {
      login (email: "any_email@gmail.com", password: "any_password") {
        accessToken
        name
      }
    }`

    test('should return an Account on valid credentions ', async () => {
      const password = await hash('any_password', 12)
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password
      })

      const response = await request(app)
        .post('/graphql')
        .send({ query })

      expect(response.body.data.login.accessToken).toBeTruthy()
      expect(response.body.data.login.name).toBe
        ('any_name')
    })

    test('should return UnauthorizedError on invalid credentions ', async () => {
      const response = await request(app)
        .post('/graphql')
        .send({ query })

      expect(response.status).toBe(401)
      expect(response.body.data).toBeFalsy()
      expect(response.body.errors[0].message).toBe
        ('Unauthorized')
    })
  });

  describe('SignUp Mutation', () => {
    const query = `mutation {
      signUp (name: "any_name", email: "any_email@gmail.com", password: "any_password", passwordConfirmation: "any_password") {
        accessToken
        name
      }
    }`

    test('should return an Account on valid data', async () => {
      const response = await request(app)
        .post('/graphql')
        .send({ query })

      expect(response.body.data.signUp.accessToken).toBeTruthy()
      expect(response.body.data.signUp.name).toBe
        ('any_name')
    })

    test('should return EmailInUseError on invalid data', async () => {
      const password = await hash('any_password', 12)
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password
      })

      const response = await request(app)
        .post('/graphql')
        .send({ query })

      expect(response.body.data).toBeFalsy()
      expect(response.body.errors[0].message).toBe
        ('The received email is already in use')
    })
  });
});