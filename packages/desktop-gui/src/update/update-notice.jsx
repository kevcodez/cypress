import React from 'react'
import { observer } from 'mobx-react'

import updateStore from './update-store'

import Notification from '../notifications/notification'
import { faShippingFast } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const UpdateNotice = observer(({ onOpenUpdatesModal }) => {
  const onClose = () => {
    updateStore.setDismissedUpdateVersion()
  }

  const onLearnMore = (e) => {
    e.preventDefault()
    updateStore.setDismissedUpdateVersion()

    onOpenUpdatesModal()
  }

  return (
    <Notification className='update-notice' show={updateStore.nonDismissedUpdateAvailable} onClose={onClose}>
      <FontAwesomeIcon icon={faShippingFast} />
      An update ({updateStore.newVersion}) is available.{' '}
      <a href='#' onClick={onLearnMore}>Learn more</a>
    </Notification>
  )
})

export default UpdateNotice
