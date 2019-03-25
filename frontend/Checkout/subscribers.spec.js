import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import subscribe from './subscribers';

jest.mock('@shopgate/pwa-common/streams/app', () => ({
  appWillStart$: 'APP_WILL_START_MOCK',
}));
/**
 * Mocked resolver.
 */
let mockedResolver = () => {};
jest.mock('@shopgate/pwa-core/classes/PipelineRequest', () => (
  mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
    mockedResolver(mockInstance, resolve, reject);
  })
));

const mockedRedirectsSetSpy = jest.fn();
jest.mock('@shopgate/pwa-common/collections', () => ({
  redirects: {
    set: (...args) => {
      mockedRedirectsSetSpy(...args);
    },
  },
}));

const mockedAddCallbackSpy = jest.fn();
jest.mock('@shopgate/pwa-core/classes/Event', () => ({
  addCallback: (...args) => mockedAddCallbackSpy(...args),
}));

let mockedUserIsLoggedIn = false;
jest.mock('@shopgate/pwa-common/selectors/user', () => ({
  isUserLoggedIn: () => mockedUserIsLoggedIn,
}));

jest.mock('@shopgate/pwa-common-commerce/checkout/actions/fetchCheckoutUrl', () => async () => 'https://example.com');

const mockedCrossDomainTrackingSpy = jest.fn();
jest.mock('@shopgate/tracking-core/core/Core', () => ({
  crossDomainTracking: (url) => {
    mockedCrossDomainTrackingSpy(url);
    return url;
  },
}));

describe('Subscribers', () => {
  const mockedSubscribe = jest.fn();
  let stream;
  let callback;
  let redirectHandler;
  let successCallback;

  it('should subscribe to appWillStart$', () => {
    subscribe(mockedSubscribe);
    expect(mockedSubscribe).toHaveBeenCalled();

    // eslint-disable-next-line prefer-destructuring
    [stream, callback] = mockedSubscribe.mock.calls[0];
    expect(stream).toBe('APP_WILL_START_MOCK');
    expect(typeof callback).toBe('function');
  });

  it('should prepare redirect handler and checkout success event on app start', () => {
    callback();
    expect(mockedRedirectsSetSpy).toHaveBeenCalled();
    expect(mockedAddCallbackSpy).toHaveBeenCalled();

    const [path, handler, force] = mockedRedirectsSetSpy.mock.calls[0];
    expect(path).toBe('/checkout');
    expect(typeof handler).toBe('function');
    expect(force).toBe(true);

    const [successEvent, successCb] = mockedAddCallbackSpy.mock.calls[0];

    expect(successEvent).toBe('checkoutSuccess');
    expect(typeof successCb).toBe('function');

    redirectHandler = handler;
    successCallback = successCb;
  });

  describe('redirectHandler', () => {
    it('should return empty string if user is logged out', async () => {
      mockedUserIsLoggedIn = false;
      expect(await redirectHandler({ getState: () => {} })).toBe('');
    });

    it('should return decorated string if user can do a checkout', async () => {
      mockedUserIsLoggedIn = true;
      expect(await redirectHandler({
        getState: () => {},
        dispatch: a => a,
      }))
        .toBe('https://example.com');
      expect(mockedCrossDomainTrackingSpy).toHaveBeenCalledWith('https://example.com');
    });
  });

  describe('Checkout success event callback', () => {
    it('should return early when there is no order data', () => {
      expect(successCallback()).toBe(undefined);
    });
    it('should call pipeline to mark shop order', (done) => {
      mockedResolver = (mockedInstance, resolve) => {
        expect(mockedInstance.input).toEqual({ orderId: 'ORDER_NUMBER' });
        resolve();
        done();
      };
      successCallback({
        order: {
          number: 'ORDER_NUMBER',
        },
      });
    });
  });
});
