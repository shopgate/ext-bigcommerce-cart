const PATHNAME = '/cart';

const history = {
  pathname: PATHNAME,
};

const activeIsLoading = {};
activeIsLoading[PATHNAME] = 1;

export const mockedStateNotLoading = {
  history,
  view: {
    isLoading: {},
  },
};

export const mockedStateLoading = {
  history,
  view: {
    isLoading: activeIsLoading,
  },
};

