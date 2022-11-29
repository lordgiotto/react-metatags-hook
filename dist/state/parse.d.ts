import { MetaTagsConfig, MetaTagModel } from '../types';
declare const parseMetaConfig: ({ title, description, lang, charset, metas, links, openGraph, twitter, }: MetaTagsConfig) => MetaTagModel;
export default parseMetaConfig;
