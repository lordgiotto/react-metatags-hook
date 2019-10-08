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
    it('should add meta tags', async () => {
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
    it('should add link tags', async () => {
      const { unmount } = renderHook(() =>
        useMetaTags({
          links: [
            { rel: 'icon', type: 'image/ico', href: '/favicon.ico' },
            {
              rel: 'apple-touch-icon',
              sizes: '72x72',
              type: 'image/png',
              href: '/apple-72.png',
            },
            { rel: 'stylesheet', href: '/style.css' },
          ],
        })
      )
      expect(
        queryHeadSelectorAttribute('link[rel="icon"]', 'href')
      ).toBeUndefined()
      expect(
        queryHeadSelectorAttribute('link[rel="apple-touch-icon"]', 'href')
      ).toBeUndefined()
      expect(
        queryHeadSelectorAttribute('link[rel="stylesheet"]', 'href')
      ).toBeUndefined()
      await wait(50)
      expect(queryHeadSelectorAttribute('link[rel="icon"]', 'href')).toBe(
        '/favicon.ico'
      )
      expect(
        queryHeadSelectorAttribute('link[rel="apple-touch-icon"]', 'href')
      ).toBe('/apple-72.png')
      expect(queryHeadSelectorAttribute('link[rel="stylesheet"]', 'href')).toBe(
        '/style.css'
      )
      unmount()
    })
    it('should add open graph tags', async () => {
      const { unmount } = renderHook(() =>
        useMetaTags({
          openGraph: {
            title: 'Page Title',
            site_name: 'My Site',
            any: 'value',
          },
        })
      )
      expect(
        queryHeadSelectorAttribute('meta[property="og:title"]', 'content')
      ).toBeUndefined()
      expect(
        queryHeadSelectorAttribute('meta[property="og:site_name"]', 'content')
      ).toBeUndefined()
      expect(
        queryHeadSelectorAttribute('meta[property="og:any"]', 'content')
      ).toBeUndefined()
      await wait(50)
      expect(
        queryHeadSelectorAttribute('meta[property="og:title"]', 'content')
      ).toBe('Page Title')
      expect(
        queryHeadSelectorAttribute('meta[property="og:site_name"]', 'content')
      ).toBe('My Site')
      expect(
        queryHeadSelectorAttribute('meta[property="og:any"]', 'content')
      ).toBe('value')
      unmount()
    })
    it('should add twitter tags', async () => {
      const { unmount } = renderHook(() =>
        useMetaTags({
          twitter: {
            card: 'summary',
            creator: '@you',
            any: 'value',
          },
        })
      )
      expect(
        queryHeadSelectorAttribute('meta[property="twitter:card"]', 'content')
      ).toBeUndefined()
      expect(
        queryHeadSelectorAttribute(
          'meta[property="twitter:creator"]',
          'content'
        )
      ).toBeUndefined()
      expect(
        queryHeadSelectorAttribute('meta[property="twitter:any"]', 'content')
      ).toBeUndefined()
      await wait(50)
      expect(
        queryHeadSelectorAttribute('meta[property="twitter:card"]', 'content')
      ).toBe('summary')
      expect(
        queryHeadSelectorAttribute(
          'meta[property="twitter:creator"]',
          'content'
        )
      ).toBe('@you')
      expect(
        queryHeadSelectorAttribute('meta[property="twitter:any"]', 'content')
      ).toBe('value')
      unmount()
    })
  })
  describe('when used multiple times, with 50ms debounce', () => {
    it('should merge the meta configs (prioritizing the last rendered components) and apply the changes once', async () => {
      const { unmount: unmountFirst } = renderHook(() =>
        useMetaTags({
          title: 'A title',
          description: 'A description',
          metas: [
            { 'http-equiv': 'Cache-Control', content: 'no-cache' },
            { name: 'robots', content: 'index, follow' },
          ],
          links: [
            { rel: 'icon', type: 'image/ico', href: '/favicon.ico' },
            {
              rel: 'apple-touch-icon',
              sizes: '72x72',
              type: 'image/png',
              href: '/apple-72.png',
            },
          ],
          openGraph: {
            title: 'og title',
          },
        })
      )
      await wait(0)
      const { unmount: unmountSecond } = renderHook(() =>
        useMetaTags({
          title: 'Another title',
          metas: [{ name: 'robots', content: 'index, nofollow' }],
          links: [
            { rel: 'icon', type: 'image/ico', href: '/favicon2.ico' },
            {
              rel: 'apple-touch-icon',
              sizes: '32x32',
              type: 'image/png',
              href: '/apple-32.png',
            },
          ],
          openGraph: {
            description: 'og description',
          },
        })
      )
      expect(document.title).toBe('')
      expect(
        queryHeadSelectorAttribute('meta[name="description"]', 'content')
      ).toBeUndefined()
      expect(
        queryHeadSelectorAttribute(
          'meta[http-equiv="Cache-Control"]',
          'content'
        )
      ).toBeUndefined()
      expect(
        queryHeadSelectorAttribute('meta[name="robots"]', 'content')
      ).toBeUndefined()
      expect(
        queryHeadSelectorAttribute('link[rel="icon"]', 'href')
      ).toBeUndefined()
      expect(
        queryHeadSelectorAttribute(
          'link[rel="apple-touch-icon"][sizes="72x72"]',
          'href'
        )
      ).toBeUndefined()
      expect(
        queryHeadSelectorAttribute('meta[property="og:title"]', 'content')
      ).toBeUndefined()
      await wait(50)
      expect(document.title).toBe('Another title')
      expect(
        queryHeadSelectorAttribute('meta[name="description"]', 'content')
      ).toBe('A description')
      expect(
        queryHeadSelectorAttribute(
          'meta[http-equiv="Cache-Control"]',
          'content'
        )
      ).toBe('no-cache')
      expect(queryHeadSelectorAttribute('meta[name="robots"]', 'content')).toBe(
        'index, nofollow'
      )
      expect(queryHeadSelectorAttribute('link[rel="icon"]', 'href')).toBe(
        '/favicon2.ico'
      )
      expect(
        queryHeadSelectorAttribute(
          'link[rel="apple-touch-icon"][sizes="72x72"]',
          'href'
        )
      ).toBe('/apple-72.png')
      expect(
        queryHeadSelectorAttribute(
          'link[rel="apple-touch-icon"][sizes="32x32"]',
          'href'
        )
      ).toBe('/apple-32.png')
      expect(
        queryHeadSelectorAttribute('meta[property="og:title"]', 'content')
      ).toBe('og title')
      expect(
        queryHeadSelectorAttribute(
          'meta[property="og:description"]',
          'content'
        )
      ).toBe('og description')
      unmountFirst()
      unmountSecond()
    })
    it('should "unmerge" a config when the component that defines it is unmounted', async () => {
      const { unmount: unmountFirst } = renderHook(() =>
        useMetaTags({
          title: 'A title',
          description: 'A description',
          metas: [{ name: 'robots', content: 'index, follow' }],
        })
      )
      await wait(0)
      const { unmount: unmountSecond } = renderHook(() =>
        useMetaTags({
          title: 'Another title',
          metas: [{ name: 'keywords', content: 'a, list, of, keywords' }],
        })
      )
      await wait(50)
      expect(document.title).toBe('Another title')
      expect(
        queryHeadSelectorAttribute('meta[name="description"]', 'content')
      ).toBe('A description')
      expect(queryHeadSelectorAttribute('meta[name="robots"]', 'content')).toBe(
        'index, follow'
      )
      expect(
        queryHeadSelectorAttribute('meta[name="keywords"]', 'content')
      ).toBe('a, list, of, keywords')
      await wait(0)
      unmountSecond()
      await wait(50)
      expect(document.title).toBe('A title')
      expect(
        queryHeadSelectorAttribute('meta[name="description"]', 'content')
      ).toBe('A description')
      expect(queryHeadSelectorAttribute('meta[name="robots"]', 'content')).toBe(
        'index, follow'
      )
      expect(
        queryHeadSelectorAttribute('meta[name="keywords"]', 'content')
      ).toBeUndefined()
      unmountFirst()
    })
  })
})
