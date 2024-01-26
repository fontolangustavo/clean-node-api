
import request from 'supertest'
import { hash } from 'bcrypt';
import { createTestClient } from 'apollo-server-integration-testing'
import { Collection } from 'mongodb';
import { ApolloServer, gql } from 'apollo-server-express';

import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { makeApolloServer } from './helpers';

let accountCollection: Collection
let apolloServer: ApolloServer

describe('Login GraphQL', () => {

  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('Login Query', () => {
    test('should return an Account on valid credentions ', async () => {
      const loginQuery = gql`
        query login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            accessToken
            name
          }
        }
      `

      const password = await hash('any_password', 12)

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password
      })

      const { query } = createTestClient({
        apolloServer
      })

      const response: any = await query(loginQuery, {
        variables: {
          email: 'any_email@gmail.com',
          password: 'any_password'
        }
      })

      expect(response.data.login.accessToken).toBeTruthy()
      expect(response.data.login.name).toBe
        ('any_name')
    })
  });
});