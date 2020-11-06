import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Tooltip from '@cypress/react-tooltip'
import { BrowserIcon, Dropdown } from '@packages/ui-components'

import MarkdownRenderer from '../lib/markdown-renderer'
import projectsApi from '../projects/projects-api'
import { faExclamationTriangle, faInfoCircle, faSyncAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

@observer
export default class Browsers extends Component {
  render () {
    const project = this.props.project

    if (!project.browsers.length) return null

    return (
      <ul className='browsers nav'>
        {this._closeBrowserBtn()}
        <Dropdown
          className='browsers-list'
          disabled={project.browserState === 'opened' || project.browserState === 'opening'}
          chosen={project.chosenBrowser}
          others={project.otherBrowsers}
          onSelect={this._onSelect}
          renderItem={this._browser}
          keyProperty='path'
          browserState={project.browserState}
        />
      </ul>
    )
  }

  _closeBrowserBtn () {
    if (this.props.project.browserState === 'opened') {
      return (
        <li className='close-browser'>
          <button className='btn btn-xs btn-danger' onClick={this._closeBrowser.bind(this)}>
            <FontAwesomeIcon icon={faTimes} fixedWidth/>
            Stop
          </button>
        </li>
      )
    }
  }

  _closeBrowser = (e) => {
    e.preventDefault()
    projectsApi.closeBrowser(this.props.project)
  }

  _onSelect = (browser) => {
    this.props.project.setChosenBrowser(browser)
  }

  _browser = (browser) => {
    const project = this.props.project
    let icon
    let prefixText

    if (project.browserState === 'opening') {
      icon = <FontAwesomeIcon icon={faSyncAlt} spin />
      prefixText = 'Opening'
    } else if (project.browserState === 'opened') {
      icon = <FontAwesomeIcon icon={faCheckCircle} className="green" />
      prefixText = 'Running'
    } else {
      icon = <BrowserIcon browserName={browser.displayName} />
      prefixText = ''
    }

    return (
      <>
        {icon}{' '}
        {prefixText}{' '}
        {browser.displayName}{' '}
        {browser.majorVersion}
        {this._info(browser)}
        {this._warn(browser)}
      </>
    )
  }

  _warn (browser) {
    if (!browser.warning) return null

    return (
      <span className='browser-warning'>
        <Tooltip
          title={<MarkdownRenderer markdown={browser.warning}/>}
          placement='bottom'
          className='browser-info-tooltip cy-tooltip'
        >
          <FontAwesomeIcon icon={faExclamationTriangle} />
        </Tooltip>
      </span>
    )
  }

  _info (browser) {
    if (!browser.info) return null

    return (
      <span className='browser-info'>
        <Tooltip
          title={<MarkdownRenderer markdown={browser.info}/>}
          placement='bottom'
          className='browser-info-tooltip cy-tooltip'
        >
          <FontAwesomeIcon icon={faInfoCircle} />
        </Tooltip>
      </span>
    )
  }
}
