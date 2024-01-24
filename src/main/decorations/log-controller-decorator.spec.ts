import { Controller, HttpResponse } from "@/presentation/protocols";
import { LogControllerDecorator } from "./log-controller-decorator";
import { serverError } from "../../presentation/helpers/http/http-helper";
import { LogErrorRepository } from "@/data/protocols/db/log/log-error-repository";
import { mockLogErrorRepository } from "@/data/test";

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(request: any): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'any_name'
        }
      }

      return await Promise.resolve(httpResponse)
    }
  }

  return new ControllerStub()
}

type SutTypes = {
  sut: LogControllerDecorator,
  controllerStub: Controller,
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController ', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const request = {
      email: 'any_email@gmail.com',
      name: 'any_name',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }

    await sut.handle(request)

    expect(handleSpy).toHaveBeenCalledWith(request)
  });

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const request = {
      email: 'any_email@gmail.com',
      name: 'any_name',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }

    const httpResponse = await sut.handle(request)

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'any_name'
      }
    })
  });

  test('should call LogErrorRespository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const fakeError = new Error()
    fakeError.stack = 'any_stack'

    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(error))

    const request = {
      email: 'any_email@gmail.com',
      name: 'any_name',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }

    await sut.handle(request)

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  });
});