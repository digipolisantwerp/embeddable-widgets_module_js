# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.0.0] - 2019-10-01
- Upgrade to `zoid@9`
- Fix for error encoding special characters to send across iframe boundaries.
- [BREAKING] `zoid@9` does not let top level properties be overriden anymore, see the readme for a workaround. Follow up: https://github.com/krakenjs/zoid/issues/271
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


[Unreleased]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v1.0.7...v2.0.0
[1.0.7]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v1.0.0...v1.0.3
[1.0.0]: https://github.com/digipolisantwerp/embeddable-widgets_module_js/compare/v1.0.0
