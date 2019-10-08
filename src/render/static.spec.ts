import { generateMetasMarkup } from './static'
import { MetaTagModel } from '../types'

const model: MetaTagModel = {
  title: 'My Page title',
  lang: 'en',
  tags: {
    'meta~charset=utf-8': {
      tag: 'meta',
      attributes: {
        charset: 'utf-8',
      },
      query: [{ key: 'charset', value: 'utf-8' }],
    },
    'meta~name=viewport': {
      tag: 'meta',
      attributes: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      query: [{ key: 'name', value: 'viewport' }],
    },
    'meta~http-equiv=refresh': {
      tag: 'meta',
      attributes: {
        'http-equiv': 'refresh',
        content: '30',
      },
      query: [{ key: 'http-equiv', value: 'refresh' }],
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
  },
}

const result = `
<title>My Page title</title>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="refresh" content="30" />
<link rel="apple-touch-icon" sizes="152x152" href="./icon152.png" />
`.replace(/\n/g, '')

describe('Render > Static', () => {
  describe('generateMetasMarkup', () => {
    it('should generate meta tags static html based on a model, except for lang', () => {
      const html = generateMetasMarkup(model)
      expect(html).toBe(result)
    })
  })
})
