import { isTruthy } from '../helpers/narrowing';
import {
  MetaTag,
  LinkTag,
  TagQueryKeys,
  MetaTagsConfig,
  MetaTagModel,
  InternalTag,
} from '../types';

const queryableKeys = {
  meta: ['charset', 'name', 'property', 'http-equiv'],
  link: ['rel', 'sizes'],
};

// TODO: Reconsider internal tag implementation in order to handle more edge cases (stylesheet, charset, etc)

// Helpers that, given the tag name and the tag attributes,
// creates the interal tag rappresentation
const createInternalTag =
  (tagName: 'meta' | 'link') =>
  (tagAttributes: MetaTag | LinkTag): InternalTag => {
    const tagQueryableKeys = queryableKeys[tagName];
    const queryKeys = tagQueryableKeys
      .concat('id')
      .map<TagQueryKeys | undefined>((queryKey) =>
        tagAttributes.hasOwnProperty(queryKey)
          ? { key: queryKey, value: tagAttributes[queryKey] }
          : undefined
      )
      .filter(isTruthy);
    const fallbackQueryKeys = Object.keys(tagAttributes).map<TagQueryKeys>(
      (key) => ({
        key,
        value: tagAttributes[key]!,
      })
    );
    return {
      tag: tagName,
      query: queryKeys.length ? queryKeys : fallbackQueryKeys,
      attributes: tagAttributes,
    };
  };
const createInternalMeta = createInternalTag('meta');
const createInternalLink = createInternalTag('link');

// Transforms the hook's input config into the internal metas model
const parseMetaConfig = ({
  title,
  description,
  lang,
  charset,
  metas = [],
  links = [],
  openGraph = {},
  twitter = {},
}: MetaTagsConfig): MetaTagModel => {
  const parsedMetaTags = metas.map(createInternalMeta);
  const parsedLinks = links.map(createInternalLink);
  const parsedOpenGraph = Object.keys(openGraph).map((key) =>
    createInternalMeta({
      property: `og:${key}`,
      content: openGraph[key],
    })
  );
  const parsedTwitter = Object.keys(twitter).map((key) =>
    createInternalMeta({
      property: `twitter:${key}`,
      content: twitter[key],
    })
  );
  const fullTagsList = [
    !!description && {
      tag: 'meta',
      query: [{ key: 'name', value: 'description' }],
      attributes: {
        name: 'description',
        content: description,
      },
    },
    !!charset && {
      tag: 'meta',
      query: [{ key: 'charset' }],
      attributes: {
        charset,
      },
    },
    ...parsedMetaTags,
    ...parsedLinks,
    ...parsedOpenGraph,
    ...parsedTwitter,
  ]
    .filter(isTruthy)
    .filter((tag) => tag.query.length);
  const tags = fullTagsList.reduce<Record<string, InternalTag>>(
    (acc, internalTag) => {
      const tagQueryId = internalTag.query
        .map(({ key = '', value = '' }) => `${key}=${value}`)
        .join('~');
      const tagId = `${internalTag.tag}_${tagQueryId}`;
      return {
        ...acc,
        [tagId]: internalTag,
      };
    },
    {}
  );
  return {
    title,
    lang,
    tags,
  };
};

export default parseMetaConfig;
