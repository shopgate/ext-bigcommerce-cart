import goBackHistory from '@shopgate/pwa-common/actions/history/goBackHistory';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import trackingCore from '@shopgate/tracking-core/core/Core';
import { LEGACY_URL } from '@shopgate/pwa-common-commerce/checkout/constants';
import { openedCheckoutLink$ } from '@shopgate/pwa-common-commerce/checkout/streams';
import fetchCheckoutUrl from '@shopgate/pwa-common-commerce/checkout/actions/fetchCheckoutUrl';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { ERROR_HANDLE_SUPPRESS } from '@shopgate/pwa-core/constants/ErrorHandleTypes';
import event from '@shopgate/pwa-core/classes/Event';
import {
  MARK_SHOPGATE_ORDER_PIPELINE,
  CHECKOUT_SUCCESS_EVENT,
} from '../constants';

/**
 * Checkout subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function checkout(subscribe) {
  /**
   * Gets triggered when the user enters the checkout.
   */
  subscribe(openedCheckoutLink$, ({ dispatch }) => {
    const started = Date.now();
    dispatch(fetchCheckoutUrl())
      .then((url) => {
        // Forget if it took more than 20 seconds. User is already back.
        if (Date.now() - started > 20000) {
          return;
        }
        /**
         * Build the complete checkout url. Fallback to the
         * legacy url if the Pipeline returns an invalid url.
         * Add some tracking params for cross domain tracking.
         */
        const checkoutUrl = trackingCore.crossDomainTracking(url || LEGACY_URL);

        // Open the checkout.
        const link = new ParsedLink(checkoutUrl);
        link.open();
        dispatch(goBackHistory(1));
      })
      .catch(() => {
        dispatch(goBackHistory(1));
      });
  });

  subscribe(appDidStart$, () => {
    event.addCallback(CHECKOUT_SUCCESS_EVENT, (data = {}) => {
      if (typeof data.order === 'undefined') {
        return;
      }

      new PipelineRequest(MARK_SHOPGATE_ORDER_PIPELINE)
        .setHandleErrors(ERROR_HANDLE_SUPPRESS)
        .setInput({ orderId: data.order.number })
        .dispatch()
        .catch(err => logger.error(err));
    });
  });
}
