import parseMetaConfig from './parse'

const metaTagsConfig = {
  title: 'A title',
  description: 'A description',
  lang: 'en-gb',
  charset: 'utf-8',
  metas: [
    { name: 'keywords', content: 'a, list, of, keywords' },
    { name: 'robots', content: 'index, follow' },
    { property: 'fb:app_id', content: '1234567890' },
    { 'http-equiv': 'Cache-Control', content: 'no-cache' },
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
    title: 'Page Title',
    image: 'http://yourwebsite.com/ogimage.jpg',
    site_name: 'My Site',
  },
  twitter: {
    card: 'summary',
    creator: '@you',
    title: 'Page Title',
  },
}

describe('parseMetaConfig()', () => {
  const metaTagsModel = parseMetaConfig(metaTagsConfig)

  it('should set title in the model', () => {
    expect(metaTagsModel.title).toBe('A title')
  })
  it('should set lang in the model', () => {
    expect(metaTagsModel.lang).toBe('en-gb')
  })
  it('should add the correct tags number to the tag list in the model', () => {
    expect(Object.keys(metaTagsModel.tags)).toHaveLength(14)
  })
  it('should add description to the tags list in the model', () => {
    const description = metaTagsModel.tags['meta_name=description']
    expect(description.tag).toBe('meta')
    expect(description.query).toEqual([{ key: 'name', value: 'description' }])
    expect(description.attributes).toEqual({ name: 'description', content: 'A description' })
  })
  it('should add charset to the tags list in the model', () => {
    const charset = metaTagsModel.tags['meta_charset=']
    expect(charset.tag).toBe('meta')
    expect(charset.query).toEqual([{ key: 'charset' }])
    expect(charset.attributes).toEqual({ charset: 'utf-8' })
  })
  it('should add metas to the tags list in the model', () => {
    // keywords
    const keywords = metaTagsModel.tags['meta_name=keywords']
    expect(keywords.tag).toBe('meta')
    expect(keywords.query).toEqual([{ key: 'name', value: 'keywords' }])
    expect(keywords.attributes).toEqual({ name: 'keywords', content: 'a, list, of, keywords' })
    // robots
    const robots = metaTagsModel.tags['meta_name=robots']
    expect(robots.tag).toBe('meta')
    expect(robots.query).toEqual([{ key: 'name', value: 'robots' }])
    expect(robots.attributes).toEqual({ name: 'robots', content: 'index, follow' })
    // property=fb:app_id
    const fbAppId = metaTagsModel.tags['meta_property=fb:app_id']
    expect(fbAppId.tag).toBe('meta')
    expect(fbAppId.query).toEqual([{ key: 'property', value: 'fb:app_id' }])
    expect(fbAppId.attributes).toEqual({ property: 'fb:app_id', content: '1234567890' })
    // http-equiv=Cache-Control
    const httpEquivCacheControl = metaTagsModel.tags['meta_http-equiv=Cache-Control']
    expect(httpEquivCacheControl.tag).toBe('meta')
    expect(httpEquivCacheControl.query).toEqual([{ key: 'http-equiv', value: 'Cache-Control' }])
    expect(httpEquivCacheControl.attributes).toEqual({ 'http-equiv': 'Cache-Control', content: 'no-cache' })
  })
})
