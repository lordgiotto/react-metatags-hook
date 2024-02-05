## 2.0.0 - 2024-02-04

- Reworked and improved meta tags merging logic, with full support of [double useEffect trigger](https://legacy.reactjs.org/docs/strict-mode.html#ensuring-reusable-state) in development.
- New ESM version (alongside the CJS one) of the distribution code with support for tree-shaking.
- Set react peer dependency to support any version `>=16.8.0`.
- Upgraded all dev dependencies.
- Improved testing tooling.
- Adapted code to the latest react types definitions.
- Various type safety improvements.
- Reworked Typescript, ESLint and Prettier configuration.

### Breaking Changes

- Library's default export is deprecated. Please import the named export `useMetaTags` instead. (e.g. `import { useMetaTags } from 'react-metatags-hook’`)
- `useMetaTags()` dependencies array is now required.
- The logic of meta tags merging from multiple `useMetaTags()`, while following the same principles as before, has been completely reworked in the implementation: in case of unexpected behaviours, please [open an issue](https://github.com/lordgiotto/react-metatags-hook/issues/new).
- Target for transpiled code changed from `es5` to `es6/es2015`, so legacy browsers (Internet Explorer) or very old NodeJS version are no longer supported without transpilation.
- Distribution code has changed structure, from file bundles to separated javascript files organized in multiple folders. If your code relies on imports of internal files within the library's file structure, it might now break.

## 1.3.1 - 2020-04-12

### Added

- Exported `MetaTag`, `LinkTag`, `MetaTagsConfig` types
- Added prettier

### Changed

- Upgraded some dependencies to fix vulnerabilities

## 1.3.0 - 2020-04-12

### Added

- Added resetMetaTags function to clear tags definitions stored in the library.

### Changed

- Fixed how meta tags definitions are merged (only defined values overwrites previously set values).
- Upgraded all dependencies.

## 1.2.0 - 2020-04-12

### Changed

- `id` is used to identify unique tags.
- Upgraded all dependencies.

## 1.1.1 - 2019-10-09

### Added

- Added unit tests.

### Changed

- Upgraded all dependencies.
- Improved internal tag representation.
- Changed js bundle generation. Removed es module version, now only the commonjs version is created.

## 1.0.3 - 2019-05-12

### Changed

- Updated npmignore.

## 1.0.1 - 2019-05-12

Initial Release.
