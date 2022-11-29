export interface MetaTag {
    'name'?: string;
    'property'?: string;
    'http-equiv'?: string;
    'content'?: string;
    [attributeKey: string]: string | undefined;
}
export interface LinkTag {
    rel?: string;
    href?: string;
    size?: string;
    type?: string;
    media?: string;
    hreflang?: string;
    [attributeKey: string]: string | undefined;
}
export interface MetaTagsConfig {
    title?: string;
    description?: string;
    lang?: string;
    charset?: string;
    metas?: MetaTag[];
    links?: LinkTag[];
    openGraph?: {
        [key: string]: string | undefined;
    };
    twitter?: {
        [key: string]: string | undefined;
    };
}
export interface TagQueryKeys {
    key: string;
    value?: string;
}
export interface InternalTag {
    tag: string;
    query: TagQueryKeys[];
    attributes: {
        [attributeKey: string]: string | undefined;
    };
}
export interface MetaTagModel {
    title?: string;
    lang?: string;
    tags: {
        [tagId: string]: InternalTag;
    };
}
