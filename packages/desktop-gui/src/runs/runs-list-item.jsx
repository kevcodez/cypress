import _ from 'lodash'
import React, { Component } from 'react'
import Tooltip from '@cypress/react-tooltip'
import { BrowserIcon } from '@packages/ui-components'
import TimerDisplay from '../duration-timer/TimerDisplay'

import {
  browserNameFormatted,
  browserVersionFormatted,
  durationFormatted,
  getFormattedTimeFromNow,
  gravatarUrl,
  osIcon,
  stripLeadingCyDirs,
  stripSharedDirsFromDir2,
} from '../lib/utils'
import { faBan, faCheck, faCheckCircle, faDesktop, faExclamationCircle, faExclamationTriangle, faGlobe, faHourglassEnd, faSyncAlt, faTerminal, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'

const RunDuration = ({ run }) => {
  // Run was blocked due to exceeding limit
  if (run.status === 'overLimit') {
    return null
  }

  // Run has completed
  if (run.totalDuration) {
    if (run.parallelizationDisabled) {
      return (
        <Tooltip title="Parallelization was disabled for this run." placement="top" className="cy-tooltip">
          <span className='env-duration'>
            <FontAwesomeIcon icon={faExclamationTriangle} className="orange" />
            {' '}{durationFormatted(run.totalDuration)}
          </span>
        </Tooltip>
      )
    }

    return (
      <span className='env-duration'>
        <FontAwesomeIcon icon={faHourglassEnd} />
        {' '}{durationFormatted(run.totalDuration)}
      </span>
    )
  }

  // Run is still going
  if (run.createdAt) {
    return (
      <TimerDisplay startTime={run.createdAt}/>
    )
  }

  return null
}

export default class RunsListItem extends Component {
  render () {
    const run = this.props.run
    const NEWLINE = '\n'

    const getStatusIcon = (status) => {
      switch (status) {
        case 'errored':
          return <FontAwesomeIcon className={status} icon={faExclamationTriangle}/>
        case 'failed':
          return <FontAwesomeIcon className={status} icon={faExclamationCircle}/>
        case 'noTests':
          return <FontAwesomeIcon className={status} icon={faBan}/>
        case 'passed':
          return <FontAwesomeIcon className={status} icon={faCheckCircle}/>
        case 'running':
          return <FontAwesomeIcon className={status} icon={faSyncAlt} spin />
        case 'overLimit':
          return <FontAwesomeIcon className={status} icon={faExclamationTriangle}/>
        case 'timedOut':
          return <FontAwesomeIcon className={status} icon={faHourglassEnd}/>
        case null:
          return <FontAwesomeIcon className={status} icon={faTerminal}/>
        default:
          return null
      }
    }

    return (
      <li onClick={this._goToRun}>
        <div className={`row-column-wrapper ${run.status} status-data`}>
          <div>
          </div>
        </div>
        <div className='row-column-wrapper'>
          <div>
            <Tooltip title={_.startCase(run.status)} className='cy-tooltip'>
              {getStatusIcon(run.status)}
            </Tooltip>
            {' '}#{run.buildNumber}
          </div>
        </div>
        <div className='row-column-wrapper'>
          <div className='td-top-padding'>
            <div>
              {run.commit && run.commit.branch ?
                <span>
                  {run.commit.branch}
                  {this._displaySpec() ? ' / ' : null}
                </span> :
                null
              }
              {this._displaySpec()}
            </div>
            {
              run.commit ?
                <div className='msg'>
                  {
                    run.commit.authorEmail ?
                      <img
                        className='user-avatar'
                        height='13'
                        width='13'
                        src={`${gravatarUrl(run.commit.authorEmail)}`}
                      /> :
                      null
                  }
                  {
                    run.commit.message ?
                      <span className='commit-msg'>
                        {run.commit.message.split(NEWLINE)[0]}
                      </span> :
                      <div className='msg italic'>
                        - No commit info found -
                      </div>
                  }
                </div> :
                <div className='msg italic'>
                  - No commit info found -
                </div>
            }

          </div>
        </div>
        <div className='row-column-wrapper'>
          <div>
            <FontAwesomeIcon icon={faClock}/>{' '}
            {getFormattedTimeFromNow(run.createdAt)}
          </div>
        </div>
        <div className='row-column-wrapper'>
          <div className='td-padding'>
            <RunDuration run={run}/>
          </div>
        </div>
        <div className='row-column-wrapper env-data'>
          <div className='td-env-padding'>
            {/* // do we have multiple OS's ? */}
            {
              this._instancesExist() ?
                this._moreThanOneInstance() && this._osLength() > 1 ?
                  <div>
                    <FontAwesomeIcon icon={faDesktop} fixedWidth/>{' '}
                    {this._osLength()} OSs
                  </div> :
                  // or did we only actual run it on one OS
                  <div>
                    <i className={`fa-fw ${this._osIcon()}`}></i>{' '}
                    {this._osDisplay()}
                  </div> :
                null
            }
            {/* // do we have multiple browsers ? */}
            {
              this._instancesExist() ?
                this._moreThanOneInstance() && this._browsersLength() > 1 ?
                  <div className='env-msg'>
                    <FontAwesomeIcon icon={faGlobe} fixedWidth/>{' '}
                    {this._browsersLength()} browsers
                  </div> :
                  // or did we only actual run it on one browser
                  <div className='env-msg'>
                    {this._browserIcon()}{' '}
                    {this._browserDisplay()}
                  </div> :
                null
            }
          </div>
        </div>
        <div className='row-column-wrapper passing-data'>
          {
            run.status !== 'running' ?
              <div className='result'>
                <FontAwesomeIcon icon={faCheck} />{' '}
                <span>
                  {run.totalPassed || '0'}
                </span>
              </div> :
              null
          }
        </div>
        <div className='row-column-wrapper failure-data'>
          {
            run.status !== 'running' ?
              <div className='result'>
                <FontAwesomeIcon icon={faTimes} />{' '}
                <span>
                  {run.totalFailed || '0'}
                </span>
              </div> :
              null
          }
        </div>
      </li>
    )
  }

  _moreThanOneInstance () {
    return (this.props.run.instances.length > 1)
  }

  _instancesExist () {
    return (!!this.props.run.instances.length)
  }

  _displaySpec () {
    if (this.props.run.instances.length === 1) {
      return (
        this.props.run.instances[0].spec ?
          <span>
            {
              this.props.run.instances[0].integrationFolder ?
                stripSharedDirsFromDir2(this.props.run.instances[0].integrationFolder, this.props.run.instances[0].spec, this.props.run.instances[0].platform.osName) ?
                  stripSharedDirsFromDir2(this.props.run.instances[0].integrationFolder, this.props.run.instances[0].spec, this.props.run.instances[0].platform.osName) :
                  this.props.run.instances[0].spec :
                stripLeadingCyDirs(this.props.run.instances[0].spec)
            }
          </span> :
          null
      )
    }
  }

  _getUniqBrowsers () {
    if (!this.props.run.instances) return []

    return _
    .chain(this.props.run.instances)
    .map((instance) => {
      return `${_.get(instance, 'platform.browserName', '')} + ${_.get(instance, 'platform.browserVersion', '')}`
    })
    .uniq()
    .value()
  }

  _browsersLength () {
    return this._getUniqBrowsers().length
  }

  _osIcon () {
    const icon = osIcon(this.props.run.instances[0].platform.osName)

    return icon === 'desktop' ? `fas fa-${icon}` : `fab fa-${icon}`
  }

  _getUniqOs () {
    if (!this.props.run.instances) return

    return _
    .chain(this.props.run.instances)
    .map((instance) => {
      return `${_.get(instance, 'platform.osName', '')} + ${_.get(instance, 'platform.osVersion', '')}`
    })
    .uniq()
    .value()
  }

  _osLength () {
    return this._getUniqOs().length
  }

  _osDisplay = () => {
    if (this.props.run.instances && this.props.run.instances[0]) {
      return (
        `${_.get(this.props.run, 'instances[0].platform.osVersionFormatted', this.props.run.instances[0].osFormatted)}`
      )
    }
  }

  _browserIcon = () => {
    const browserName = _.get(this.props.run, 'instances[0].platform.browserName', '')

    return browserName ? <BrowserIcon browserName={browserName}/> : null
  }

  _browserDisplay = () => {
    if (this.props.run.instances && this.props.run.instances[0]) {
      return (
        `${browserNameFormatted(_.get(this.props.run, 'instances[0].platform.browserName', ''))} ${browserVersionFormatted(_.get(this.props.run, 'instances[0].platform.browserVersion', ''))}`
      )
    }
  }

  _goToRun = () => {
    this.props.goToRun(this.props.run.buildNumber)
  }
}
