import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import Loader from './index';
import { mockedStateNotLoading, mockedStateLoading } from './mock';

const mockedStore = configureStore();
const dispatcher = jest.fn();

beforeEach(() => {
  jest.resetModules();
});

describe('<Loader />', () => {
  let component = null;
  /**
   * Creates component with provided store state.
   * @param {Object} mockedState Mocked stage.
   * @param {Object} props Additional props.
   * @return {ReactWrapper}
   */
  const createComponent = (mockedState, props = {}) => {
    const store = mockedStore(mockedState);
    store.dispatch = dispatcher;

    return mount(
      <Provider store={store}>
        <Loader
          {...props}
        />
      </Provider>,
      mockRenderOptions
    );
  };

  beforeEach(() => {
    dispatcher.mockReset();
  });

  it('should only render when page is loading', () => {
    component = createComponent(mockedStateLoading);
    expect(component).toMatchSnapshot();
    expect(component.find('div').exists()).toBe(true);
  });

  it('should not render when page is not loading', () => {
    component = createComponent(mockedStateNotLoading);
    expect(component.find('div').exists()).toBe(false);
  });
});
