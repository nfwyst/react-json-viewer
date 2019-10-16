import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { checkIfArrayIsAOB, checkIfObjectIsOOB, getFirstEle, getType, loopObject } from './util';
import ValueViewer from './ValueViewer';

export default class JSONViewer extends Component {
  static propTypes = {
    json: PropTypes.any.isRequired,
    tableProps: PropTypes.object,
    trProps: PropTypes.object,
    tdProps: PropTypes.object,
    thProps: PropTypes.object,
    tbodyProps: PropTypes.object,
    theadProps: PropTypes.object,
    oneTable: PropTypes.bool,
    pureText: PropTypes.bool,
  };

  static defaultProps = {
    tableProps: {},
    trProps: {},
    tdProps: {},
    thProps: {},
    tbodyProps: {},
    theadProps: {},
    oneTable: false,
    pureText: false,
  };

  static styles = {
    td: {
      border: '1px solid #cccccc',
      textAlign: 'left',
      margin: 0,
      padding: '6px 13px',
    },
    th: {
      border: '1px solid #cccccc',
      textAlign: 'left',
      margin: 0,
      padding: '6px 13px',
      fontWeight: 'bold',
    },
  };

  objToTable(obj) {
    const { tableProps, trProps } = this.props;
    if (JSON.stringify(obj) === '{}') {
      return '{ }';
    }
    return (
      <table {...tableProps}>
        {this.renderHeaderByKeys(Object.keys(obj))}
        <tbody>
          <tr {...trProps}>
            {loopObject(obj, (v, key) => {
              return this.renderTd(v, key);
            })}
          </tr>
        </tbody>
      </table>
    );
  }

  arrayToTable(obj, oneTable) {
    const { tableProps, trProps, tdProps, tbodyProps } = this.props;
    if (getType(obj) === 'Array' && obj.length === 0) {
      return '[ ]';
    }
    const config = oneTable ? {} : tbodyProps;
    const maxKeysItem = getFirstEle(obj, oneTable);
    return (
      <table {...tableProps}>
        {oneTable ? this.renderHeaderByKeys(Object.keys(maxKeysItem)) : null}
        <tbody {...config}>
          {loopObject(obj, (v, key) => {
            return (
              <tr key={key} {...trProps}>
                {oneTable ? null : (
                  <td {...tdProps} style={this.constructor.styles.td}>{`${key}`}</td>
                )}
                {oneTable
                  ? loopObject(maxKeysItem, (val, k) => {
                      return this.renderTd(v[k] || '', k);
                    })
                  : this.renderTd(v, key)}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  oobToTable(aob) {
    const { tableProps, trProps, tdProps } = this.props;
    return (
      <table {...tableProps}>
        {this.renderHeaderByKeys(Object.keys(getFirstEle(aob)), 'addExtra')}
        <tbody>
          {loopObject(aob, (row, j) => {
            return (
              <tr {...trProps} key={j}>
                <td {...tdProps} style={this.constructor.styles.td}>
                  <ValueViewer value={j} {...this.props} />
                </td>
                {loopObject(getFirstEle(aob), (val, key) => {
                  return this.renderTd(row[key], key);
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  decideAndRender(guess, oneTable) {
    if (getType(guess) === 'Array') {
      if (checkIfArrayIsAOB(guess)) {
        return this.aobToTable(guess);
      }
      return this.arrayToTable(guess, oneTable);
    }
    if (getType(guess) === 'Object') {
      if (checkIfObjectIsOOB(guess)) {
        return this.oobToTable(guess);
      }
      return this.objToTable(guess);
    }
    return <ValueViewer value={guess} {...this.props} />;
  }

  aobToTable(aob) {
    const { tableProps, tbodyProps, trProps } = this.props;
    return (
      <table {...tableProps}>
        {this.renderHeaderByKeys(Object.keys(getFirstEle(aob)))}
        <tbody {...tbodyProps}>
          {loopObject(aob, (row, j) => {
            return (
              <tr {...trProps} key={j}>
                {loopObject(getFirstEle(aob), (val, key) => {
                  return this.renderTd(row[key], key);
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  renderTd(guess, index) {
    const { tdProps } = this.props;
    return (
      <td {...tdProps} key={index} style={this.constructor.styles.td}>
        {this.decideAndRender(guess)}
      </td>
    );
  }

  renderHeaderByKeys(keys, addExtra) {
    const { theadProps, trProps, thProps, tdProps } = this.props;
    return (
      <thead {...theadProps}>
        <tr {...trProps}>
          {(() => {
            if (addExtra === 'addExtra') {
              return (
                <th {...thProps} style={this.constructor.styles.td}>
                  <span style={{ color: 'rgb(111, 11, 11)' }} />
                </th>
              );
            }
          })()}
          {keys.map(key => {
            return (
              <th {...tdProps} key={key} style={this.constructor.styles.td}>
                <span style={{ color: 'rgb(111, 11, 11)' }}>{key}</span>
              </th>
            );
          })}
        </tr>
      </thead>
    );
  }

  render() {
    const { json, oneTable } = this.props;
    return <div>{this.decideAndRender(json, oneTable)}</div>;
  }
}
