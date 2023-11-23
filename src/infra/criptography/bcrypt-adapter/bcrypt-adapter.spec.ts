import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hash'
  },
  async compare(value: string, hash: string): Promise<boolean> {
    return true
  },
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('should call hash with correct value', async () => {
      const sut = makeSut()

      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.hash('any_value')

      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('should return a valid hash on hash success', async () => {
      const sut = makeSut()

      const hash = await sut.hash('any_value')

      expect(hash).toBe('hash')
    })

    test('should throw if bcrypt throws', async () => {
      const sut = makeSut()

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => { await Promise.reject(new Error()) })

      const promise = sut.hash('any_value')

      await expect(promise).rejects.toThrow()
    });
  });

  describe('compare()', () => {
    test('should call compare with correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')

      await sut.compare('any_value', 'any_hash')

      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('should return true when compare succeeds', async () => {
      const sut = makeSut()

      const isValid = await sut.compare('any_value', 'any_hash')

      expect(isValid).toBeTruthy()
    })

    test('should return false when compare fails', async () => {
      const sut = makeSut()

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => await Promise.resolve(false))

      const isValid = await sut.compare('any_value', 'any_hash')

      expect(isValid).toBeFalsy()
    })

    test('should throw if compare throws', async () => {
      const sut = makeSut()

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => await Promise.reject(new Error()))

      const promise = sut.compare('any_value', 'any_hash')

      await expect(promise).rejects.toThrow()
    })

  });
})
