import { updateDom } from './dom'
import { wait } from '../helpers/patience'

const tags = {
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
  'link~rel=apple-touch-icon~sizes=152x152': {
    tag: 'link',
    attributes: {
      rel: 'apple-touch-icon',
      sizes: '152x152',
      href: './icon152.png',
    },
    query: [
      { key: 'rel', value: 'apple-touch-icon' },
      { key: 'sizes', value: '152x152' },
    ],
  },
}

describe('Render > DOM', () => {
  describe('updateDom()', () => {
    afterEach(() => {
      document.head.innerHTML = ''
    })
    it('should add the title tag', async () => {
      updateDom({ title: 'ABC', tags: {} })
      await wait(0)
      expect(document.title).toBe('ABC')
    })
    it('should set document language', async () => {
      updateDom({ lang: 'en-gb', tags: {} })
      await wait(0)
      expect(document.documentElement.lang).toBe('en-gb')
    })
    it('should set meta tags', async () => {
      updateDom({ tags })
      await wait(0)
      const metas = document.head.querySelectorAll('meta')
      const links = document.head.querySelectorAll('link')
      const charsetTag = document.head.querySelector('meta[charset=utf8]')!
      const viewPortTag = document.head.querySelector('meta[name=viewport]')!
      const appleIconTag = document.head.querySelector(
        'link[rel=apple-touch-icon]'
      )!
      expect(metas).toHaveLength(2)
      expect(links).toHaveLength(1)
      expect(charsetTag).toBeTruthy()
      expect(viewPortTag.getAttribute('content')).toBe(
        'width=device-width, initial-scale=1'
      )
      expect(appleIconTag.getAttribute('sizes')).toBe('152x152')
      expect(appleIconTag.getAttribute('href')).toBe('./icon152.png')
    })
    it('should remove tags if not present in a subsequent update', async () => {
      updateDom({ tags })
      await wait(0)
      const charsetTag = document.head.querySelector('meta[charset=utf8]')!
      const viewPortTag = document.head.querySelector('meta[name=viewport]')!
      const appleIconTag = document.head.querySelector(
        'link[rel=apple-touch-icon]'
      )!
      expect(charsetTag).toBeTruthy()
      expect(viewPortTag).toBeTruthy()
      expect(appleIconTag).toBeTruthy()
      updateDom({
        tags: {
          'meta~charset=utf8': {
            tag: 'meta',
            attributes: {
              charset: 'utf8',
            },
            query: [{ key: 'charset', value: 'utf8' }],
          },
        },
      })
      await wait(0)
      const charsetTagNew = document.head.querySelector('meta[charset=utf8]')!
      const viewPortTagNew = document.head.querySelector(
        'meta[name=viewport]'
      )!
      const appleIconTagNew = document.head.querySelector(
        'link[rel=apple-touch-icon]'
      )!
      expect(charsetTagNew).toBeTruthy()
      expect(viewPortTagNew).toBeFalsy()
      expect(appleIconTagNew).toBeFalsy()
    })
  })
})
