import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import style from './styles';

/**
 * The Loader component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Loader = props => (
  props.showLoadLoader ? <div className={style} /> : null
);

Loader.propTypes = {
  showLoadLoader: PropTypes.bool,
};

Loader.defaultProps = {
  showLoadLoader: false,
};

export default connect(Loader);
