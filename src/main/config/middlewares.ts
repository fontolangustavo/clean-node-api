import { Express } from 'express'
import { bodyParser, contentType, cors } from '../middlewares'
import setupSwagger from './config-swagger'

export default (app: Express): void => {
  setupSwagger(app)
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}