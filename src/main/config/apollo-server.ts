import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'

import typeDefs from '../graphql/type-defs'
import resolvers from '../graphql/resolvers'
import { GraphQLError } from 'graphql'

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

export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    resolvers: resolvers,
    typeDefs: typeDefs,
    plugins: [
      {
        requestDidStart: async () => ({
          willSendResponse: async ({ response, errors }) => handleErrors(response, errors)
        })
      }
    ]
  })

  await server.start();

  server.applyMiddleware({
    app
  })
}