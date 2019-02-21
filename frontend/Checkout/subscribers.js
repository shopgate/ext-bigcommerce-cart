import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';
import trackingCore from '@shopgate/tracking-core/core/Core';
import { FETCH_CHECKOUT_URL_TIMEOUT } from '@shopgate/pwa-common-commerce/checkout/constants';
import { redirects } from '@shopgate/pwa-common/collections';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import fetchCheckoutUrl from '@shopgate/pwa-common-commerce/checkout/actions/fetchCheckoutUrl';
import { appWillStart$ } from '@shopgate/pwa-common/streams/app';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { ERROR_HANDLE_SUPPRESS } from '@shopgate/pwa-core/constants/ErrorHandleTypes';
import event from '@shopgate/pwa-core/classes/Event';
import {
  MARK_SHOPGATE_ORDER_PIPELINE,
  CHECKOUT_SUCCESS_EVENT,
} from '../constants';

/**
 * @param {Object} params The handler parameters.
 * @param {Function} params.dispatch The Redux dispatch function.
 * @param {Function} params.getState The Redux getState function.
 * @return {Promise<string>}
 */
const redirectHandler = async ({ getState, dispatch }) => {
  if (!isUserLoggedIn(getState())) {
    return '';
  }

  const started = Date.now();
  const url = await dispatch(fetchCheckoutUrl());

  // Check if it took more than PWA allows. User is already back.
  if (Date.now() - started > FETCH_CHECKOUT_URL_TIMEOUT) {
    return '';
  }

  /**
     * Build the complete checkout url. Fallback to the
     * legacy url if the Pipeline returns an invalid url.
     * Add some tracking params for cross domain tracking.
     */
  return trackingCore.crossDomainTracking(url);
};

/**
 * Checkout subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function checkout(subscribe) {
  subscribe(appWillStart$, () => {
    redirects.set(CHECKOUT_PATH, redirectHandler, true);
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
