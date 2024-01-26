import express, { Express } from 'express'

import setupStaticFiles from '@/main/config/static-files'
import setupSwagger from '@/main/config/swagger'
import setupMiddleware from '@/main/config/middlewares'
import setupRoutes from '@/main/config/routes'
import { setupApolloServer } from '../graphql/apollo'

export const setupApp = async (): Promise<Express> => {
  const app = express()

  setupStaticFiles(app)
  setupSwagger(app)
  setupMiddleware(app)
  setupRoutes(app)

  const server = setupApolloServer()
  await server.start()

  server.applyMiddleware({ app })

  return app
}