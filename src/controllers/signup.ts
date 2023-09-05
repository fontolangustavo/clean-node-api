import { MissingParamError } from '../presentation/errors/missing-param-error'
import { badRequest } from '../presentation/helpers/http-helper'
import type { Controller } from '../protocols/controller'
import type { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'password_confirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return {
      statusCode: 200,
      body: {}
    }
  }
}
