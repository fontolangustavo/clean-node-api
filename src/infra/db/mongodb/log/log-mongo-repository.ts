import { LogErrorRepository } from "@/data/protocols/db/log/log-error-repository";
import { MongoHelper } from "../helpers/mongo-helper";

export class LogMongoRespository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errorCollection = MongoHelper.getCollection('errors')

    await errorCollection.insertOne({
      stack,
      data: new Date()
    })
  }
}
