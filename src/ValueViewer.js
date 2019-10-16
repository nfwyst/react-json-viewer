import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { getType } from './util';

class ValueViewer extends Component {
  r() {
    const { value, pureText = false } = this.props;
    switch (getType(value)) {
      case 'String':
        return (
          <span style={{ color: 'rgb(255, 65, 60)' }}>{pureText ? `${value}` : `"${value}"`}</span>
        );
      case 'Boolean':
        return <span style={{ color: 'rgb(31, 48, 255)' }}>{`${value}`}</span>;
      case 'Number':
        return <span style={{ color: 'rgb(31, 49, 255)' }}>{`${value}`}</span>;
      case 'Undefined':
        return <i style={{ color: '#777777' }}>undefined</i>;
      case 'Null':
        return <i style={{ color: '#777777' }}>null</i>;
      case 'Date':
        return <i style={{ color: '#007bc7' }}>{`${JSON.stringify(value)}`}</i>;
      default:
        return <span style={{ color: 'rgb(31, 49, 255)' }}>{`${value}`}</span>;
    }
  }

  render() {
    return <span>{this.r()}</span>;
  }
}
ValueViewer.propTypes = {
  value: PropTypes.any,
};
ValueViewer.defaultProps = {
  value: '',
};
export default ValueViewer;
