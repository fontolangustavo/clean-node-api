import { AccessDeniedError } from "../errors";
import { forbidden } from "../helpers/http/http-helper";
import { HttpRequest, HttpResponse, Middleware } from "../protocols";

export class AuthMiddleware implements Middleware {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.headers?.accessToken) {
      return Promise.resolve(forbidden(new AccessDeniedError()))
    }
    return Promise.resolve(null)
  }
}