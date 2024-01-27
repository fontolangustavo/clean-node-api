import { MongoClient, type Collection } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },
  async disconnect(): Promise<void> {
    await this.client.close()
  },
  getCollection(name: string): Collection {
    return this.client.db().collection(name)
  },
  map: (data: any): any => {
    if (data) {
      const { _id, insertedId, ...dataWithoutId } = data

      return Object.assign({ ...dataWithoutId, id: _id || insertedId })
    }

    return null
  },
  mapCollection: (collection: any[]): any[] => {
    return collection.map((item) => MongoHelper.map(item))
  }
}
