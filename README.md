# Shopgate Cloud - Extension BigCommerce Cart
[![GitHub license](http://dmlc.github.io/img/apache2.svg)](LICENSE.md)
[![Build Status](https://travis-ci.org/shopgate/ext-bigcommerce-cart.svg?branch=master)](https://travis-ci.org/shopgate/ext-bigcommerce-cart)

This BigCommerce extension will sync the cart from Shopgate to BigCommerce

## Integration Tests

The integration tests will only work when there is a file named .integration-credentials.js in folder extension. 
It must contain the credentials to our BigCommerce test shop. The file is formatted as follow:

```
module.exports = {
  clientId: '***',
  accessToken: '***',
  storeHash: '***'
}
```

Replace the asterik with real credentials.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) file for more information.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize native
apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.

## License

Shopgate Cloud - Extension BigCommerce Cart is available under the Apache License, Version 2.0.

See the [LICENSE](./LICENSE.md) file for more information.
