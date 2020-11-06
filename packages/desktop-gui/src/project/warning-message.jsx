import React, { Component } from 'react'
import { observer } from 'mobx-react'
import MarkdownRenderer from '../lib/markdown-renderer'
import { faExclamationTriangle, faSync, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

@observer
class WarningMessage extends Component {
  render () {
    const { warning } = this.props
    const warningText = warning.message.split('\n').join('<br />')

    return (
      <div className='alert alert-warning'>
        <p className='header'>
          <FontAwesomeIcon icon={faExclamationTriangle} />{' '}
          <strong>Warning</strong>
        </p>
        <div>
          <MarkdownRenderer markdown={warningText}/>
          {warning.isRetryable &&
            <button
              className='retry-button btn btn-default btn-sm'
              disabled={warning.isRetrying}
              onClick={this.props.onRetry}
            >
              <FontAwesomeIcon icon={faSync} spin={warning.isRetrying} />
              {warning.isRetrying ? 'Retrying...' : 'Try Again'}
            </button>
          }
        </div>
        <button className='btn btn-link close' onClick={this.props.onDismissWarning}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    )
  }
}

export default WarningMessage
