import { renderHook } from '@testing-library/react-hooks'
import { wait } from './helpers/patience'
import useMetaTags from './use-meta-tags'

const queryHeadSelectorAttribute = (selector: string, attribute: string) => {
  const element = document.head.querySelector(selector)
  return element ? element.getAttribute(attribute) : undefined
}

describe('Meta Tags Hook', () => {
  const resetDom = () => {
    document.title = ''
    document.documentElement.lang = ''
    document.head.innerHTML = ''
  }
  beforeAll(resetDom)
  afterEach(resetDom)
  describe('when used inside a component, with 50ms debounce time', () => {
    it('should set the document title', async () => {
      const { unmount } = renderHook(() =>
        useMetaTags({
          title: 'A title',
        })
      )
      expect(document.title).toBe('')
      await wait(50)
      expect(document.title).toBe('A title')
      unmount()
    })
    it('should set the document language', async () => {
      const { unmount } = renderHook(() =>
        useMetaTags({
          lang: 'en-gb',
        })
      )
      expect(document.documentElement.lang).toBe('')
      await wait(50)
      expect(document.documentElement.lang).toBe('en-gb')
      unmount()
    })
    it('should add the description tag', async () => {
      const { unmount } = renderHook(() =>
        useMetaTags({
          description: 'A description',
        })
      )
      expect(
        queryHeadSelectorAttribute('meta[name="description"]', 'content')
      ).toBeUndefined()
      await wait(50)
      expect(
        queryHeadSelectorAttribute('meta[name="description"]', 'content')
      ).toBe('A description')
      unmount()
    })
    it('should add the charset tag', async () => {
      const { unmount } = renderHook(() =>
        useMetaTags({
          charset: 'utf-8',
        })
      )
      expect(
        queryHeadSelectorAttribute('meta[charset]', 'charset')
      ).toBeUndefined()
      await wait(50)
      expect(queryHeadSelectorAttribute('meta[charset]', 'charset')).toBe(
        'utf-8'
      )
      unmount()
    })
    it('should add the charset tag', async () => {
      const { unmount } = renderHook(() =>
        useMetaTags({
          charset: 'utf-8',
        })
      )
      expect(
        queryHeadSelectorAttribute('meta[charset]', 'charset')
      ).toBeUndefined()
      await wait(50)
      expect(queryHeadSelectorAttribute('meta[charset]', 'charset')).toBe(
        'utf-8'
      )
      unmount()
    })
    it('should add any meta tag', async () => {
      const { unmount } = renderHook(() =>
        useMetaTags({
          metas: [
            { name: 'robots', content: 'index, follow' },
            { property: 'fb:app_id', content: '1234567890' },
            { 'http-equiv': 'Cache-Control', content: 'no-cache' },
            { any: 'value', foo: 'baz' },
          ],
        })
      )
      expect(
        queryHeadSelectorAttribute('meta[name="robots"]', 'content')
      ).toBeUndefined()
      expect(
        queryHeadSelectorAttribute('meta[property="fb:app_id"]', 'content')
      ).toBeUndefined()
      expect(
        queryHeadSelectorAttribute(
          'meta[http-equiv="Cache-Control"]',
          'content'
        )
      ).toBeUndefined()
      expect(
        queryHeadSelectorAttribute('meta[any="value"]', 'foo')
      ).toBeUndefined()
      await wait(50)
      expect(queryHeadSelectorAttribute('meta[name="robots"]', 'content')).toBe(
        'index, follow'
      )
      expect(
        queryHeadSelectorAttribute('meta[property="fb:app_id"]', 'content')
      ).toBe('1234567890')
      expect(
        queryHeadSelectorAttribute(
          'meta[http-equiv="Cache-Control"]',
          'content'
        )
      ).toBe('no-cache')
      expect(queryHeadSelectorAttribute('meta[any="value"]', 'foo')).toBe(
        'baz'
      )
      unmount()
    })
  })
})
