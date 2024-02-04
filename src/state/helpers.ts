import { MetaTagsModel } from '../types';

// Compares two meta models and return the removed tags
export const getRemovedTags = (
  metas: MetaTagsModel,
  prevMetas: MetaTagsModel
) =>
  Object.keys(prevMetas.tags || {})
    .filter((tagId) => !metas.tags[tagId])
    .map((tagId) => prevMetas.tags[tagId]!);

// Returns the plain array of tags from the meta model
export const getTagsList = (metas: MetaTagsModel) =>
  Object.keys(metas.tags || {}).map((tagId) => metas.tags[tagId]!);
