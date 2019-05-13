# React MetaTags Hook
React hook to manage HTML meta tags.

### Supported Tags
- `title`
- `description`
- `charset`
- `lang` on the html tag
- Any `<meta>` and `<link>`
- Convenient way to set `og:*` and `twitter:*` meta tags

### Features
- Dependencies array, to better control the update of meta tags
- When a component is unmounted, its meta tags are removed
- When possible, existing tags are updated rather then re-created (even if created in different components)
- DOM changes are debounced to avoid pointless consecutive updates
- When used in sibling or nested components, meta tags are merged: last rendered components (i.e. the inner ones) overrides common meta tags.
- Supports static HTML generation for Server Side Rendering
- Typescript declarations

## Install
```
  npm install react-metatags-hook
```
or
```
  yarn add react-metatags-hook
```
## Example
``` js
import useMetaTags from 'react-metatags-hook'

const Component = ({
  match,
}) => {
  const {
    params: { id },
    url,
  } = match
  useMetaTags({
    title: `Page Title`,
    description: `An interesting page description with id: ${id}`,
    charset: 'utf8',
    lang: 'en',
    metas: [
      { name: 'keywords', content: 'a, list, of, keywords' },
      { name: 'robots', content: 'index, follow' },
      { name: 'DC.Title', content: 'Dublin Core Title' },
      { name: 'url', content: `http://yourwebsite.com${url}` },
      { property: 'fb:app_id', content: '1234567890' },
      { 'http-equiv': 'Cache-Control', content: 'no-cache' },
    ],
    links: [
      { rel: 'canonical', href: 'http://yourwebsite.com' },
      { rel: 'icon', type: 'image/ico', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '72x72', type: 'image/png', href: '/apple-72.png' },
    ],
    openGraph: {
      title: 'Page Title',
      image: 'http://yourwebsite.com/ogimage.jpg',
      'site_name': 'My Site'
    },
    twitter: {
      card: 'summary',
      creator: '@you',
      title: 'Page Title',
    }
  }, [id, url])
  return (
    <>
      ...
    </>
  )
}
```

## Usage
```typescript
useMetaTags(config: MetaTagsConfig, dependencies?: any[])
```

### MetaTagsConfig
```typescript
interface MetaTagsConfig {
  title?: string
  description?: string
  lang?: string
  charset?: string
  metas?: MetaTag[]
  links?: LinkTag[]
  openGraph?: {
    [key: string]: string,
  }
  twitter?: {
    [key: string]: string,
  }
}
```
The config object accepts the following options:
##### `title`
Sets the `<title>` tag
##### `description`
Sets the `<meta name="description" />` tag (convenient way, same as using `metas`)
##### `lang`
Sets `<html>` tag lang attribute
##### `description`
Sets the `<meta charset="" />` tag (convenient way, same as using `metas`)
##### `metas`
``` typescript
interface MetaTag {
  name?: string
  property?: string
  'http-equiv'?: string
  content?: string
  [attributeKey: string]: string
}
```
An array of object that represents the `<meta />` tags
##### `links`
``` typescript
interface LinkTag {
  rel?: string
  href?: string
  size?: string
  type?: string
  media?: string
  [attributeKey: string]: string
}
```
An array of object that represents the `<link />` tags
##### `openGraph`
A convenient method to set `<meta property="og:*" />` meta tags. Accepts an object where the key is appended in the `property` attribute after the `og:` prefix, and the value is the `content` attribute of the meta.
##### `twitter`
A convenient method to set `<meta property="twitter:*" />` meta tags. Accepts an object where the key is appended in the `property` attribute after the `twitter:` prefix, and the value is the `content` attribute of the meta.

## Server Side Rendering
This library exports the function `generateStaticHtml` that can be used to generate an HTML string of the meta tags created by this hook. Use it after `ReactDOMServer.renderToString` or `ReactDOMServer.renderToStaticMarkup`.
```javascript
import { generateStaticHtml } from 'react-metatags-hook'
...
ReactDOMServer.renderToString(<App />);
const metaHTML = generateStaticHtml()
```

## What happens when used in multiple component or one component is unmounted
### Nested and Sibling components
When used in nested components, the meta defined in the children are merged with the ones defined in the parents. If the same meta are defined in both the parent and the children, the children ones take precedence and overwrite parents ones.

The same logic applies if used in sibling components: the last to render is the one that take precedence if same meta are defined.

### Component unmount
When a component that uses this hook is unmounted, its meta definition are removed from a global list of meta and the meta definition is recalculated based on the definitions in other components. If some meta is not longer present in this resulting definition, the meta tag is removed from the DOM.

### How `<meta />` and `<link />` are identified
To identify which `<meta />` and `<link />` are unique (used to merge meta definition as just described, as well as to delete or update the DOM), the following logic is applied.

**meta**
- have the same `name` attribute
- have the same `property` attribute
- have the same `http-equiv` attribute
- have the same `charset` attribute

**link**:
- have the same `rel` attribute
- have the same `rel` and `sizes` attribute

If this logic is unsatisfactory, please let me know and I'll be happy to improve it.
