import { MetaTagModel } from '../types'
import { getRemovedTags, getTagsList } from './helpers'

const modelA: MetaTagModel = {
  title: 'title',
  lang: 'en',
  tags: {
    'meta~charset=utf8': {
      tag: 'meta',
      attributes: {
        charset: 'utf8',
      },
      query: [
        { key: 'charset', value: 'utf8' },
      ],
    },
    'meta~name=viewport': {
      tag: 'meta',
      attributes: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      query: [
        { key: 'name', value: 'viewport' },
      ],
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

const modelB: MetaTagModel = {
  title: 'title',
  lang: 'en',
  tags: {
    'meta~charset=utf8': {
      tag: 'meta',
      attributes: {
        charset: 'utf8',
      },
      query: [
        { key: 'charset', value: 'utf8' },
      ],
    },
    'meta~name=viewport': {
      tag: 'meta',
      attributes: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      query: [
        { key: 'name', value: 'viewport' },
      ],
    },
    'link~rel=icon': {
      tag: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      query: [
        { key: 'rel', value: 'icon' },
      ],
    },
    'meta~http-equiv=refresh': {
      tag: 'meta',
      attributes: {
        'http-equiv': 'refresh',
        content: '30',
      },
      query: [
        { key: 'http-equiv', value: 'refresh' },
      ],
    },
  },
}

describe('getRemovedTags()', () => {
  it('should return the removed tags in the first model in relation of the second one', () => {
    expect(getRemovedTags(modelB, modelA)).toEqual([
      {
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
    ])
    expect(getRemovedTags(modelA, modelB)).toEqual([
      {
        tag: 'link',
        attributes: {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
        query: [
          { key: 'rel', value: 'icon' },
        ],
      },
      {
        tag: 'meta',
        attributes: {
          'http-equiv': 'refresh',
          content: '30',
        },
        query: [
          { key: 'http-equiv', value: 'refresh' },
        ],
      },
    ])
  })
  it('should return an empty array if the model doesn\'t change', () => {
    const unchangedModelA = { ...modelA }
    const unchangedModelB = { ...modelB }
    expect(getRemovedTags(modelA, unchangedModelA)).toEqual([])
    expect(getRemovedTags(modelB, unchangedModelB)).toEqual([])
  })
})
describe('getTagsList()', () => {
  it('should return a plain list of tags from a model', () => {
    expect(getTagsList(modelA)).toEqual([
      {
        tag: 'meta',
        attributes: {
          charset: 'utf8',
        },
        query: [
          { key: 'charset', value: 'utf8' },
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        query: [
          { key: 'name', value: 'viewport' },
        ],
      },
      {
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
    ])
    expect(getTagsList(modelB)).toEqual([
      {
        tag: 'meta',
        attributes: {
          charset: 'utf8',
        },
        query: [
          { key: 'charset', value: 'utf8' },
        ],
      },
      {
        tag: 'meta',
        attributes: {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        query: [
          { key: 'name', value: 'viewport' },
        ],
      },
      {
        tag: 'link',
        attributes: {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
        query: [
          { key: 'rel', value: 'icon' },
        ],
      },
      {
        tag: 'meta',
        attributes: {
          'http-equiv': 'refresh',
          content: '30',
        },
        query: [
          { key: 'http-equiv', value: 'refresh' },
        ],
      },
    ])
  })
})
