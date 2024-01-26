import { ApolloServer } from 'apollo-server-express'
import { GraphQLError } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'

import typeDefs from '../type-defs'
import resolvers from '../resolvers'
import { authDirectiveTransformer } from '../directives'

const handleErrors = (response: any, errors: readonly GraphQLError[]) => {
  errors?.forEach(error => {
    response.data = undefined
    if (checkError(error, 'UserInputError')) {
      return response.http.status = 400
    } else if (checkError(error, 'AuthenticationError')) {
      return response.http.status = 401
    } else if (checkError(error, 'ForbiddenError')) {
      return response.http.status = 403
    } else {
      return response.http.status = 500
    }
  })
}

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].some(name => name === errorName)
}

let schema = makeExecutableSchema({ resolvers, typeDefs })
schema = authDirectiveTransformer(schema)

export const setupApolloServer = (): ApolloServer => new ApolloServer({
  schema,
  context: ({ req }) => ({ req }),
  plugins: [
    {
      requestDidStart: async () => ({
        willSendResponse: async ({ response, errors }) => handleErrors(response, errors)
      })
    }
  ]
})

