import { TagQueryKeys, InternalTag, MetaTagModel } from '../types'
import { getRemovedTags, getTagsList } from '../state'

const getHeadElement = (tagName: string, query: TagQueryKeys[]) => {
  const queryAttributes = query
    .reduce((acc, { key, value }) =>
        acc + `[${key}${value ? '="' + value + '"' : ''}]`
    , '')
  return document.head.querySelector(tagName + queryAttributes)
}
const createHeadElement = (tagName: string) => {
  const newTag = document.createElement(tagName)
  document.head.appendChild(newTag)
  return newTag
}

const setTitle = (title: string) => {
  document.title = title
}
const setLang = (lang: string) => {
  document.documentElement.lang = lang
}
const setHeadElement = ({ tag, query, attributes }: InternalTag) => {
  const element = getHeadElement(tag, query) || createHeadElement(tag)
  attributes &&
    Object.keys(attributes).forEach(name => {
      element.setAttribute(name, attributes[name] || '')
    })
}
const removeHeadElement = ({ tag, query }: InternalTag) => {
  const element = getHeadElement(tag, query)
  element &&
    document.head.removeChild(element)
}

// Public
let domChangeTimeout: number
let lastMetas: MetaTagModel = { tags: {} }

export const updateDom = (metas: MetaTagModel, debounceTime?: number) => {
  if (typeof window !== 'undefined') {
    window.clearTimeout(domChangeTimeout)
    domChangeTimeout = setTimeout(() => {
      const removedTags = getRemovedTags(metas, lastMetas)
      const tags = getTagsList(metas)
      lastMetas = metas
      metas.title && setTitle(metas.title)
      metas.lang && setLang(metas.lang)
      tags.forEach(setHeadElement)
      removedTags.forEach(removeHeadElement)
    }, debounceTime)
  }
}
