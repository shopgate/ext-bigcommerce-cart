import goBackHistory from '@shopgate/pwa-common/actions/history/goBackHistory';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import trackingCore from '@shopgate/tracking-core/core/Core';
import { LEGACY_URL } from '@shopgate/pwa-common-commerce/checkout/constants';
import { openedCheckoutLink$ } from '@shopgate/pwa-common-commerce/checkout/streams';
import fetchCheckoutUrl from '@shopgate/pwa-common-commerce/checkout/actions/fetchCheckoutUrl';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import event from '@shopgate/pwa-core/classes/Event';

const MARK_SHOPGATE_ORDER = 'bigcommerce.checkout.markOrderAsShopgate'

/**
 * Checkout subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function checkout(subscribe) {
  /**
   * Gets triggered when the user enters the checkout.
   */
  subscribe(openedCheckoutLink$, ({ dispatch, getState }) => {

    dispatch(fetchCheckoutUrl())
      .then((url) => {
        /**
         * Build the complete checkout url. Fallback to the
         * legacy url if the Pipeline returns an invalid url.
         * Add some tracking params for cross domain tracking.
         */
        const checkoutUrl = trackingCore.crossDomainTracking(url || LEGACY_URL);

        // Open the checkout.
        const link = new ParsedLink(checkoutUrl);
        link.open();
      })
      .catch(e => e);

    dispatch(goBackHistory(1));
  });

  subscribe(appDidStart$, () => {
    event.addCallback('checkoutSuccess', (data = {}) => {
      if (typeof data.order === 'undefined') {
        return;
      }

      const orderNumber = data.order.number;

      new PipelineRequest(MARK_SHOPGATE_ORDER)
        .setInput({ orderId: orderNumber })
        .dispatch()
        .catch(err => logger.error(err));
    });
  });
};
