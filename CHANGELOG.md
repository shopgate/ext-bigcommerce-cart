# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [2.1.1] - 2020-07-24
### Fixed
- make sure customerId is 0 for not logged in users instead of NaN

## [2.1.0] - 2019-04-12
### Added
- saves the cart id and userAgent to BigAPI service on all cart modification calls
### Fixed
- show the right error message if product is not available
- timestamp issue on generate token for checkout

## [2.0.0] - 2019-02-21
### Added
- showing sku and product options in the cart
- logging for all API calls
### Changed
- migrated frontend to PWA6
### Fixed
- issue when adding variant products to the cart
- aligned handling of get cart response to the information available

## [1.5.2] - 2019-01-04
### Fixed
- providing feedback when add to cart fails and ensuring unknown errors are sent out.

## [1.5.1] - 2018-10-29
### Fixed
- add to cart that was failing on first run.
- merge of carts during login process when anonymous cart had variants.
- breaking the login process when cart merge fails.

## [1.5.0] - 2018-08-10
### Added
- dispatch goBack action after checkout url is fetched.

## [1.4.3] - 2018-07-26
### Changed
- removed nsp as dev dependency.

## [1.4.2] - 2018-07-25
### Changed
- changed use of storage.map logging method to better utilize it.
- changed how items are added to cart so that when adding another of the same product its quantity is updated.

## [1.4.1] - 2018-07-06
### Changed
- changed error handling so as not to lock update cart requests on the backend in favor of frontend solution.

## [1.4.0] - 2018-06-29
### Added
- showing update cart errors with cart level messages.

## [1.3.0] - 2018-06-22
### Added
- support for cart level customer discounts.

## [1.2.0] - 2018-06-11
### Added
- invocation of "markOrderAsShopgate" pipeline from frontend code by subscribing to the checkoutSuccess event

### Changed
- changed the way the bigcommerce cart calculates and returns its cart amount

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

[Unreleased]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v2.1.0...HEAD
[2.1.0]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v1.5.2...v2.0.0
[1.5.2]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v1.5.1...v1.5.2
[1.5.1]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v1.4.3...v1.5.0
[1.4.3]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v1.4.2...v1.4.3
[1.4.2]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/shopgate/cloud-ext-bigcommerce-cart/compare/v1.1.0...v1.2.0
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
