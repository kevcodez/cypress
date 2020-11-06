import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { Dropdown } from '@packages/ui-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle, faGraduationCap, faChevronLeft, faUser, faSpinner, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import appStore from '../lib/app-store'
import authApi from '../auth/auth-api'
import authStore from '../auth/auth-store'
import viewStore from '../lib/view-store'
import ipc from '../lib/ipc'
import { gravatarUrl } from '../lib/utils'
import { Link, routes } from '../lib/routing'

@observer
export default class Nav extends Component {
  render () {
    return (
      <nav className='main-nav navbar navbar-inverse'>
        <ul className='nav'>
          <li>
            {this._leftNav()}
          </li>
        </ul>
        <div className='spacer' />
        <ul className='nav'>
          <li>
            <a onClick={this._openSupport} href='#'>
              <FontAwesomeIcon icon={faQuestionCircle} /> Support
            </a>
          </li>
          <li>
            <a onClick={this._openDocs} href='#'>
              <FontAwesomeIcon icon={faGraduationCap} /> Docs
            </a>
          </li>
          {this._userStateButton()}
        </ul>
      </nav>
    )
  }

  _leftNav = () => {
    const project = viewStore.currentView.project

    // project mode
    if (!appStore.isGlobalMode) {
      return <div>{project && project.displayName}</div>
    }

    // global mode, on project page
    if (appStore.isGlobalMode && project) {
      return (
        <Link to={routes.intro()}>
          <FontAwesomeIcon icon={faChevronLeft} /> Back
        </Link>
      )
    }

    // global mode, on intro page
    return (
      <div className='logo'>
        <img src={require('@cypress/icons/dist/logo/cypress-inverse.png')} />
      </div>
    )
  }

  _userStateButton = () => {
    if (authStore.isLoading) {
      return (
        <li>
          <div>
            <FontAwesomeIcon icon={faUser} /> <FontAwesomeIcon icon={faSpinner} spin />
          </div>
        </li>
      )
    }

    if (!authStore.isAuthenticated) {
      return (
        <li>
          <a onClick={this._showLogin}>
            <FontAwesomeIcon icon={faUser} /> Log In
          </a>
        </li>
      )
    }

    return (
      <Dropdown
        className='user-dropdown'
        chosen={{ id: 'user' }}
        others={[{ id: 'logout' }]}
        onSelect={this._select}
        renderItem={this._item}
        keyProperty='id'
      />
    )
  }

  _item (item) {
    if (item.id === 'user') {
      return (
        <span>
          <img
            className='user-avatar'
            height='13'
            width='13'
            src={`${gravatarUrl(authStore.user.email)}`}
          />
          {' '}{authStore.user.displayName}
        </span>
      )
    }

    return (
      <span>
        <FontAwesomeIcon icon={faSignOutAlt} />{' '}
        Log Out
      </span>
    )
  }

  _select = (item) => {
    if (item.id === 'logout') {
      authApi.logOut()
    }
  }

  _showLogin () {
    authStore.openLogin()
  }

  _openDocs (e) {
    e.preventDefault()
    ipc.externalOpen('https://on.cypress.io')
  }

  _openSupport (e) {
    e.preventDefault()
    ipc.externalOpen('https://on.cypress.io/support')
  }
}
