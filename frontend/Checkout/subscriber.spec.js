// import event from '@shopgate/pwa-core/classes/Event';
// import { appWillStart$ } from '@shopgate/pwa-common/streams/app';
// import { openedCheckoutLink$ } from '@shopgate/pwa-common-commerce/checkout/streams';
// import { logger } from '@shopgate/pwa-core/helpers';
// import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
// import { ERROR_HANDLE_SUPPRESS } from '@shopgate/pwa-core/constants/ErrorHandleTypes';
// import {
//   CHECKOUT_SUCCESS_EVENT,
//   MARK_SHOPGATE_ORDER_PIPELINE,
// } from '../constants';
// import subscribers from './subscribers';
//
// jest.mock('@shopgate/pwa-core/classes/Event');
//
// const mockedDispatchResolver = jest.fn();

// jest.mock('@shopgate/pwa-core/classes/PipelineRequest', () => mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
//   mockedDispatchResolver(mockInstance, resolve, reject);
// }));

// jest.mock('@shopgate/pwa-core/helpers', () => ({
//   logger: {
//     error: jest.fn(),
//   },
// }));

describe.skip('Subscribers', () => {
  const mockedSubscribe = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    subscribers(mockedSubscribe);
  });

  it('should subscribe as expected', () => {
    expect(mockedSubscribe).toHaveBeenCalledTimes(2);
  });

  describe('openedCheckoutLink$', () => {
    let stream;
    let callback;

    beforeEach(() => {
      [[stream, callback]] = mockedSubscribe.mock.calls;
    });

    it('should setup as expected', () => {
      expect(stream).toEqual(openedCheckoutLink$);
      expect(callback).toBeInstanceOf(Function);
    });
  });

  describe('appWillStart$', () => {
    let stream;
    let callback;

    beforeEach(() => {
      [, [stream, callback]] = mockedSubscribe.mock.calls;
    });

    it('should setup as expected', () => {
      expect(stream).toEqual(appDidStart$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should register a handler for the checkoutSuccess app event', () => {
      callback();
      expect(event.addCallbackSpy).toHaveBeenCalledTimes(1);
      expect(event.addCallbackSpy).toHaveBeenCalledWith(
        CHECKOUT_SUCCESS_EVENT,
        expect.any(Function)
      );
    });

    describe('checkoutSuccess event handler', () => {
      const orderId = '1337';
      const mockedOrderData = {
        order: {
          number: orderId,
        },
      };

      let handler;

      beforeEach(() => {
        callback();
        [[, handler]] = event.addCallbackSpy.mock.calls;
      });

      it('should work as expected with empty data', () => {
        handler();
        expect(mockedDispatchResolver).not.toHaveBeenCalled();
      });

      it('should work as expected with valid data', () => {
        handler(mockedOrderData);
        expect(mockedDispatchResolver).toHaveBeenCalledTimes(1);

        const [[mockInstance]] = mockedDispatchResolver.mock.calls;
        expect(mockInstance.name).toBe(MARK_SHOPGATE_ORDER_PIPELINE);
        expect(mockInstance.handleErrors).toBe(ERROR_HANDLE_SUPPRESS);
        expect(mockInstance.input).toEqual({ orderId });
      });

      it('should log when an error occurs', async () => {
        const error = new Error();
        mockedDispatchResolver.mockImplementationOnce((instance, resolve, reject) => {
          reject(error);
        });

        await handler(mockedOrderData);

        expect(mockedDispatchResolver).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenCalledWith(error);
      });
    });
  });
});
