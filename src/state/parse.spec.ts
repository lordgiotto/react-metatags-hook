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
    { rel: 'alternate', href: 'https://www.site.com', id: 'alt1' },
    { rel: 'alternate', href: 'https://www.site2.com', id: 'alt2' },
  ],
  openGraph: {
    title: 'Page Title',
    site_name: 'My Site',
  },
  twitter: {
    card: 'summary',
    creator: '@you',
  },
}
describe('State > Parse', () => {
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
      expect(description.query).toEqual([
        { key: 'name', value: 'description' },
      ])
      expect(description.attributes).toEqual({
        name: 'description',
        content: 'A description',
      })
    })
    it('should add charset to the tags list in the model', () => {
      const charset = metaTagsModel.tags['meta_charset=']
      expect(charset.tag).toBe('meta')
      expect(charset.query).toEqual([{ key: 'charset' }])
      expect(charset.attributes).toEqual({ charset: 'utf-8' })
    })
    it('should add a name/content meta to the tags list in the model', () => {
      const keywords = metaTagsModel.tags['meta_name=keywords']
      const robots = metaTagsModel.tags['meta_name=robots']
      expect(keywords.tag).toBe('meta')
      expect(keywords.query).toEqual([{ key: 'name', value: 'keywords' }])
      expect(keywords.attributes).toEqual({
        name: 'keywords',
        content: 'a, list, of, keywords',
      })
      expect(robots.tag).toBe('meta')
      expect(robots.query).toEqual([{ key: 'name', value: 'robots' }])
      expect(robots.attributes).toEqual({
        name: 'robots',
        content: 'index, follow',
      })
    })
    it('should add a property/content meta to the tags list in the model', () => {
      const fbAppId = metaTagsModel.tags['meta_property=fb:app_id']
      expect(fbAppId.tag).toBe('meta')
      expect(fbAppId.query).toEqual([{ key: 'property', value: 'fb:app_id' }])
      expect(fbAppId.attributes).toEqual({
        property: 'fb:app_id',
        content: '1234567890',
      })
    })
    it('should add a http-equiv/content meta to the tags list in the model', () => {
      const httpEquivCacheControl =
        metaTagsModel.tags['meta_http-equiv=Cache-Control']
      expect(httpEquivCacheControl.tag).toBe('meta')
      expect(httpEquivCacheControl.query).toEqual([
        { key: 'http-equiv', value: 'Cache-Control' },
      ])
      expect(httpEquivCacheControl.attributes).toEqual({
        'http-equiv': 'Cache-Control',
        content: 'no-cache',
      })
    })
    it('should add a simple rel link to the tags list in the model', () => {
      const icon = metaTagsModel.tags['link_rel=icon']
      expect(icon.tag).toBe('link')
      expect(icon.query).toEqual([{ key: 'rel', value: 'icon' }])
      expect(icon.attributes).toEqual({
        rel: 'icon',
        type: 'image/ico',
        href: '/favicon.ico',
      })
    })
    it('should add a rel/sizes link to the tags list in the model', () => {
      const appleIcon =
        metaTagsModel.tags['link_rel=apple-touch-icon~sizes=72x72']
      expect(appleIcon.tag).toBe('link')
      expect(appleIcon.query).toEqual([
        { key: 'rel', value: 'apple-touch-icon' },
        { key: 'sizes', value: '72x72' },
      ])
      expect(appleIcon.attributes).toEqual({
        rel: 'apple-touch-icon',
        sizes: '72x72',
        type: 'image/png',
        href: '/apple-72.png',
      })
    })
    it('should add openGraph metas to the tags list in the model', () => {
      const ogTitle = metaTagsModel.tags['meta_property=og:title']
      const ogSite = metaTagsModel.tags['meta_property=og:site_name']
      expect(ogTitle.tag).toBe('meta')
      expect(ogTitle.query).toEqual([{ key: 'property', value: 'og:title' }])
      expect(ogTitle.attributes).toEqual({
        property: 'og:title',
        content: 'Page Title',
      })
      expect(ogSite.tag).toBe('meta')
      expect(ogSite.query).toEqual([
        { key: 'property', value: 'og:site_name' },
      ])
      expect(ogSite.attributes).toEqual({
        property: 'og:site_name',
        content: 'My Site',
      })
    })
    it('should add twitter metas to the tags list in the model', () => {
      const twitterCard = metaTagsModel.tags['meta_property=twitter:card']
      const twitterCreator =
        metaTagsModel.tags['meta_property=twitter:creator']
      expect(twitterCard.tag).toBe('meta')
      expect(twitterCard.query).toEqual([
        { key: 'property', value: 'twitter:card' },
      ])
      expect(twitterCard.attributes).toEqual({
        property: 'twitter:card',
        content: 'summary',
      })
      expect(twitterCreator.tag).toBe('meta')
      expect(twitterCreator.query).toEqual([
        { key: 'property', value: 'twitter:creator' },
      ])
      expect(twitterCreator.attributes).toEqual({
        property: 'twitter:creator',
        content: '@you',
      })
    })
    it('should always consider tags with different "id" as different tags', () => {
      const altLink1 = metaTagsModel.tags['link_rel=alternate~id=alt1']
      const altLink2 = metaTagsModel.tags['link_rel=alternate~id=alt2']
      expect(altLink1.tag).toBe('link')
      expect(altLink1.query).toEqual([
        { key: 'rel', value: 'alternate' },
        { key: 'id', value: 'alt1' },
      ])
      expect(altLink1.attributes).toEqual({
        rel: 'alternate',
        href: 'https://www.site.com',
        id: 'alt1',
      })
      expect(altLink2.tag).toBe('link')
      expect(altLink2.query).toEqual([
        { key: 'rel', value: 'alternate' },
        { key: 'id', value: 'alt2' },
      ])
      expect(altLink2.attributes).toEqual({
        rel: 'alternate',
        href: 'https://www.site2.com',
        id: 'alt2',
      })
    })
  })
})
