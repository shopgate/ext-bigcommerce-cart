# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [1.1.0] - 2018-05-28
### Added
- new pipeline "markOrderAsShopgate" that adds a staff note to a Bigcommerce order

## [1.0.1] - 2018-05-23
### Fixed
- fixed case when user has no cart and there is no anonymous cart

## [1.0.0] - 2018-05-16
### Added
- product variants can now be added to the cart

## [0.2.0] - 2018-05-08
### Added
- new pipeline "bigcommerce.checkout.getUrl" which can get the url for the BigCommerce checkout
- authorisation with user credentials for pipeline shopgate.checkout.getUrl 
- Travis integration

## [0.1.5] - 2018-04-16
### Added
- new pipeline "bigcommerce.cart.mergeOnLogin" which merges anonymous + user cart on logging

## [0.1.4] - 2018-04-03
### Changed
- pipelines renamed according to the new naming scheme

## [0.1.3] - 2018-02-20
### Added
- functionality to update simple product in cart
- functionality to delete product from cart

## [0.1.2] - 2018-02-07
### Added
- true support for async/await and JS promises in steps

## [0.1.1] - 2018-02-07
### Fixed
- wrong subtotal in cart view

## [0.1.0] - 2018-01-26
### Added
- functionality to add simple products to the cart
- functionality to return BigCommerce checkout url

[Unreleased]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v0.2.0...v1.0.0
[0.2.0]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v0.1.5...v0.2.0
[0.1.5]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/tree/v0.1.0
