import * as express from 'express';
import setupMiddleware from './middlewares'
import setupRoutes from './routes'

const app = (express as any).default();
setupMiddleware(app)
setupRoutes(app)

export default app
