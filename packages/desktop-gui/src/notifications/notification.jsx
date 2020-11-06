import cs from 'classnames'
import React from 'react'
import { CSSTransition } from 'react-transition-group'
import { Portal } from '@packages/ui-components'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Notification = ({ children, className, onClose, show }) => {
  return (
    <Portal>
      <CSSTransition in={show} timeout={500} classNames='notification'>
        <div className={cs('notification', className)}>
          <div className='notification-wrap'>
            <div className='content'>
              {children}
            </div>
            <button className='notification-close' onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      </CSSTransition>
    </Portal>
  )
}

export default Notification
