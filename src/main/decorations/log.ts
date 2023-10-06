import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller

  constructor(controller: Controller) {
    this.controller = controller
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = this.controller.handle(httpRequest)

    if ((await httpResponse).statusCode === 500) {

    }

    return httpResponse
  }

}