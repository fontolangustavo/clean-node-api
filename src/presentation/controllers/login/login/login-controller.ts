import { badRequest, ok, serverError, unauthorized } from "@/presentation/helpers/http/http-helper"
import { Authentication, Controller, HttpRequest, HttpResponse, Validation } from "./login-controller-protocols"

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) { }

  async handle(request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)

      }

      const { email, password } = request

      const authentication = await this.authentication.auth({ email, password })
      if (!authentication) {
        return unauthorized()
      }

      return ok(authentication)
    } catch (error) {
      return serverError(error)
    }
  }

}

export namespace LoginController {
  export type Request = {
    email: string
    password: string
  }
}
