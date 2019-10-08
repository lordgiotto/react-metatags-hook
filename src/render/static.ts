import { MetaTagModel } from '../types'
import { getTagsList } from '../state'

// Public
export const generateMetasMarkup = (metas: MetaTagModel) => {
  const title = metas.title ? `<title>${metas.title}</title>` : ''
  const tagsList = getTagsList(metas)
  const tags = tagsList.map(({ attributes, tag }) => {
    const attributeParts = Object.keys(attributes).map(key => {
      const value = attributes[key] ? `="${attributes[key]}"` : ''
      return `${key}${value}`
    })
    return `<${tag} ${attributeParts.join(' ')} />`
  })
  return [title, ...tags].join('')
}
