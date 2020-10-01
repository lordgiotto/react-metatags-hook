## [1.3.1] - 2020-04-12

### Added

- Exported `MetaTag`, `LinkTag`, `MetaTagsConfig` types
- Added prettier

### Changed

- Upgraded some dependencies to fix vulnerabilities

## [1.3.0] - 2020-04-12

### Added

- Added resetMetaTags function to clear tags definitions stored in the library.

### Changed

- Fixed how meta tags definitions are merged (only defined values overwrites previously set values).
- Upgraded all dependencies.

## [1.2.0] - 2020-04-12

### Changed

- `id` is used to identify unique tags.
- Upgraded all dependencies.

## [1.1.1] - 2019-10-09

### Added

- Added unit tests.

### Changed

- Upgraded all dependencies.
- Improved internal tag representation.
- Changed js bundle generation. Removed es module version, now only the commonjs version is created.

## [1.0.3] - 2019-05-12

### Changed

- Updated npmignore.

## [1.0.1] - 2019-05-12

Initial Release.
