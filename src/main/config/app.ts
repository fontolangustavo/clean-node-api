import express from 'express';
import setupStaticFiles from './static-files'
import setupMiddleware from './middlewares'
import setupRoutes from './routes'

const app = express()
setupStaticFiles(app)
setupMiddleware(app)
setupRoutes(app)

export default app
