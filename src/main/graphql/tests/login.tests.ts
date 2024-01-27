
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
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Login Query', () => {
    const loginQuery = gql`
      query login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          accessToken
          name
        }
      }
    `

    test('should return an Account on valid credentions ', async () => {
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

    test('should return UnauthorizedError on invalid credentions ', async () => {
      const { query } = createTestClient({
        apolloServer
      })

      const response: any = await query(loginQuery, {
        variables: {
          email: 'any_email@gmail.com',
          password: 'any_password'
        }
      })

      expect(response.data).toBeFalsy()
      expect(response.errors[0].message).toBe
        ('Unauthorized')
    })
  });

  describe('SignUp Mutation', () => {
    const signUpMutation = gql`
      mutation signUp($name: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
        signUp(name: $name, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
          accessToken
          name
        }
      }
    `

    test('should return an Account on valid data', async () => {
      const { mutate } = createTestClient({
        apolloServer
      })

      const response: any = await mutate(signUpMutation, {
        variables: {
          name: 'any_name',
          email: 'any_email@gmail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      })

      expect(response.data.signUp.accessToken).toBeTruthy()
      expect(response.data.signUp.name).toBe
        ('any_name')
    })

    test('should return EmailInUseError on invalid data', async () => {
      const password = await hash('any_password', 12)
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password
      })

      const { mutate } = createTestClient({
        apolloServer
      })

      const response: any = await mutate(signUpMutation, {
        variables: {
          email: 'any_email@gmail.com',
          password: 'any_password'
        }
      })

      expect(response.data).toBeFalsy()
      expect(response.errors[0].message).toBe
        ('The received email is already in use')
    })
  });
});