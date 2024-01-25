import express from 'express';
import setupApolloServer from './apollo-server'
import setupStaticFiles from './static-files'
import setupMiddleware from './middlewares'
import setupRoutes from './routes'

const app = express()
setupApolloServer(app)
setupStaticFiles(app)
setupMiddleware(app)
setupRoutes(app)

export default app
