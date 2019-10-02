import { wait, nextTick } from './patience'

const TOLLERANCE = 20

describe('Helpers > Patience', () => {
  const callback = jest.fn()
  beforeEach(() => {
    callback.mockClear()
  })
  describe('wait()', () => {
    it('should return a promise that resolves after specified time', done => {
      const TIMEOUT = 50
      wait(TIMEOUT).then(callback)
      expect(callback).not.toBeCalled()
      setTimeout(() => {
        expect(callback).not.toBeCalled()
      }, TIMEOUT - TOLLERANCE)
      setTimeout(() => {
        expect(callback).toBeCalled()
        done()
      }, TIMEOUT + TOLLERANCE)
    })
  })
  describe('nextTick()', () => {
    it('should return a promise that resolves the next thick', done => {
      nextTick().then(callback)
      expect(callback).not.toBeCalled()
      // NOTE: Failed to test using process.nextTick()
      // HACK: Let's assume that nextTick should always be faster than setTimeout(0)
      setTimeout(() => {
        expect(callback).toBeCalled()
        done()
      }, 0)
    })
  })
})
