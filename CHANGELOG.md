# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [2.0.7] - 2021-03-09

- Don't polyfill smoothscroll during SSR

## [2.0.6] - 2020-09-07

### Fixed

- Revert to zoid version 9.0.31 compatible with widgets app

## [2.0.5] - 2020-09-07

### Fixed

- `render()` and `renderUrl()` now return the component instance instead of undefined

## [2.0.4] - 2020-04-27

### Fixed

- Fixed issue where widget keeps growing (chrome)

## [2.0.3] - 2020-01-27

### Fixed

- Fixed error in react when trying to pass dimensions as props
- Fixed off by one height issue with autoResize and scrolling:auto

## [2.0.1] - 2019-12-16
- Fixed React embed that was broken.

## [2.0.0] - 2019-10-01
- Upgrade to `zoid@9`
- Fix for error encoding special characters to send across iframe boundaries.
- [BREAKING] `zoid@9` does not let top level properties like `dimensions` be overriden anymore at render time, see the readme for a workaround. Follow up: https://github.com/digipolisantwerp/embeddable-widgets_module_js/issues/11
- [BREAKING] Cannot be used in combination with the v1.x version of this library. See the migration notes in the readme.


## [1.0.7] - 2019-06-04

### Fixed
- security issue in `extend` dependency


## [1.0.6] - 2019-06-03

### Fixed
- `autoResize` could not be overridden from the parent window.


## [1.0.5] - 2019-02-22

### Fixed
- Fixed issue in react when rendering a view with a widget twice.


## [1.0.4] - 2019-01-21

### Changed
- Made the loading spinner core branding compatible


## [1.0.3] - 2019-01-15

### Added
- Added support for protocol-relative URLs (//example.com/...)


## [1.0.0] - 2019-01-14
Initial release.


[Unreleased]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v2.0.7...HEAD
[2.0.7]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v2.0.6...v2.0.7
[2.0.6]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v2.0.5...v2.0.6
[2.0.5]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v2.0.4...v2.0.5
[2.0.4]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v2.0.3...v2.0.4
[2.0.3]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v2.0.1...v2.0.3
[2.0.1]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v1.0.7...v2.0.0
[1.0.7]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v1.0.0...v1.0.3
[1.0.0]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v1.0.0
