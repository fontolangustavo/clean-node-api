import { badRequest } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError } from '../../errors';

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return Promise.resolve(badRequest(new MissingParamError('email')))
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
});