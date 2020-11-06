import { observer } from 'mobx-react'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons'

import appStore from '../lib/app-store'

const GlobalError = observer(() => {
  if (!appStore.error) return null

  const remove = () => {
    appStore.setError(null)
  }

  return (
    <div className='global-error alert alert-danger'>
      <p>
        <FontAwesomeIcon icon={faExclamationTriangle} />{' '}
        <strong>{appStore.error.name || 'Unexpected Error'}</strong>
      </p>
      <p dangerouslySetInnerHTML={{
        __html: appStore.error.message.split('\n').join('<br />'),
      }} />
      <button className='btn btn-link close' onClick={remove}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  )
})

export default GlobalError
