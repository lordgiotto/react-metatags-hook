import {
  subscribeToStore,
  getState,
  clearStore,
  addMetasToStore,
  removeMetasFromStore,
} from './store'
import { MetaTagModel } from '../types'

const instanceConfigA = {
  current: {
    title: 'title',
    lang: 'en',
    tags: {
      'meta~charset=utf8': {
        tag: 'meta',
        attributes: {
          charset: 'utf8',
        },
        query: [{ key: 'charset', value: 'utf8' }],
      },
      'meta~name=viewport': {
        tag: 'meta',
        attributes: {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        query: [{ key: 'name', value: 'viewport' }],
      },
    },
  },
}
const instanceConfigB = {
  current: {
    title: 'title2',
    lang: 'it',
    tags: {
      'meta~name=viewport': {
        tag: 'meta',
        attributes: {
          name: 'viewport',
          content: 'width=device-width, initial-scale=2',
        },
        query: [{ key: 'name', value: 'viewport' }],
      },
      'link~rel=icon': {
        tag: 'link',
        attributes: {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
        query: [{ key: 'rel', value: 'icon' }],
      },
    },
  },
}
const instanceConfigC = {
  current: {
    title: 'title3',
    tags: {},
  },
}

describe('State > Store', () => {
  describe('subscribeToStore()', () => {
    it('should return an unsubscribe function', () => {
      const unsubscribe = subscribeToStore(() => {})
      expect(typeof unsubscribe).toBe('function')
    })
  })
  describe('getState()', () => {
    it('should return an empty store if nothing added', () => {
      expect(getState()).toEqual({ tags: {} })
    })
  })
  describe('when manipulated with', () => {
    let unsubscribe: () => void
    let metas: MetaTagModel
    beforeEach(() => {
      unsubscribe = subscribeToStore((metasModel) => (metas = metasModel))
    })
    afterEach(() => {
      clearStore()
      unsubscribe()
    })
    describe('addMetasToStore()', () => {
      it('should add a model to the store and provide the resulting model to subscribers and via getState()', (done) => {
        const expected = instanceConfigA.current
        addMetasToStore(instanceConfigA)
        process.nextTick(() => {
          expect(getState()).toEqual(expected)
          expect(metas).toEqual(expected)
          done()
        })
      })
      it('should merge models (last take precedence) if more the one them is added to the store', (done) => {
        const expected = {
          title: 'title3',
          lang: 'it',
          tags: {
            'meta~charset=utf8': {
              tag: 'meta',
              attributes: {
                charset: 'utf8',
              },
              query: [{ key: 'charset', value: 'utf8' }],
            },
            'meta~name=viewport': {
              tag: 'meta',
              attributes: {
                name: 'viewport',
                content: 'width=device-width, initial-scale=2',
              },
              query: [{ key: 'name', value: 'viewport' }],
            },
            'link~rel=icon': {
              tag: 'link',
              attributes: {
                rel: 'icon',
                type: 'image/x-icon',
                href: '/favicon.ico',
              },
              query: [{ key: 'rel', value: 'icon' }],
            },
          },
        }
        addMetasToStore(instanceConfigA)
        addMetasToStore(instanceConfigB)
        addMetasToStore(instanceConfigC)
        process.nextTick(() => {
          expect(getState()).toEqual(expected)
          expect(metas).toEqual(expected)
          done()
        })
      })
    })
    describe('removeMetasFromStore()', () => {
      it('should remove a model from the store and provide the resulting model to subscribers and via getState()', (done) => {
        const expected = { tags: {} }
        addMetasToStore(instanceConfigA)
        removeMetasFromStore(instanceConfigA)
        process.nextTick(() => {
          expect(getState()).toEqual(expected)
          expect(metas).toEqual(expected)
          done()
        })
      })
      it('should merge all the not removed models (last take precedence)', (done) => {
        const expected = {
          title: 'title3',
          lang: 'en',
          tags: {
            'meta~charset=utf8': {
              tag: 'meta',
              attributes: {
                charset: 'utf8',
              },
              query: [{ key: 'charset', value: 'utf8' }],
            },
            'meta~name=viewport': {
              tag: 'meta',
              attributes: {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
              },
              query: [{ key: 'name', value: 'viewport' }],
            },
          },
        }
        addMetasToStore(instanceConfigA)
        addMetasToStore(instanceConfigB)
        addMetasToStore(instanceConfigC)
        removeMetasFromStore(instanceConfigB)
        process.nextTick(() => {
          expect(getState()).toEqual(expected)
          expect(metas).toEqual(expected)
          done()
        })
      })
    })
    describe('clearStore()', () => {
      it('should clear all the saved models in the store and provide an empty model to subscribers and via getState()', (done) => {
        const expected = { tags: {} }
        addMetasToStore(instanceConfigA)
        addMetasToStore(instanceConfigB)
        clearStore()
        process.nextTick(() => {
          expect(getState()).toEqual(expected)
          expect(metas).toEqual(expected)
          done()
        })
      })
    })
  })
})
