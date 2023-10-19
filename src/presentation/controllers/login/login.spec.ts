import { badRequest } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError } from '../../errors';

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    if (!email) {
      return Promise.resolve(badRequest(new MissingParamError('email')))
    }

    if (!password) {
      return Promise.resolve(badRequest(new MissingParamError('password')))
    }
  }

}

describe('Login Controller', () => {
  test('should  return 400 if no email is provided', async () => {
    const sut = new LoginController()

    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  });

  test('should  return 400 if no password is provided', async () => {
    const sut = new LoginController()

    const httpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  });
});