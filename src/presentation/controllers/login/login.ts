import { MissingParamError } from "../../errors"
import { badRequest } from "../../helpers/http-helper"
import { Controller, EmailValidator, HttpRequest, HttpResponse } from "../../protocols"

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    if (!email || !this.emailValidator.isValid(email)) {
      return Promise.resolve(badRequest(new MissingParamError('email')))
    }

    if (!password) {
      return Promise.resolve(badRequest(new MissingParamError('password')))
    }
  }

}