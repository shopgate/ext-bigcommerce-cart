import { connect } from 'react-redux';
import { isCurrentViewLoading } from '@shopgate/pwa-common/selectors/view';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  showLoadLoader: isCurrentViewLoading(state),
});

export default connect(mapStateToProps);
