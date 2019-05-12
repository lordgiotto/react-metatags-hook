import { MetaTagModel } from '../types'

// Compares two meta models and return the removed tags
export const getRemovedTags = (metas: MetaTagModel, prevMetas: MetaTagModel) =>
  Object.keys(prevMetas.tags || {})
    .filter(tagId => !metas.tags[tagId])
    .map(tagId => prevMetas.tags[tagId])

// Returns the plain array of tags from the meta model
export const getTagsList = (metas: MetaTagModel) =>
  Object.keys(metas.tags || {})
    .map(tagId => metas.tags[tagId])
