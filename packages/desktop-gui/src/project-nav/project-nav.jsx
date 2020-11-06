import React, { Component } from 'react'

import Browsers from './browsers'
import { Link, routes } from '../lib/routing'
import { faCode, faCog, faDatabase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class ProjectNav extends Component {
  render () {
    const project = this.props.project

    return (
      <nav className='project-nav navbar navbar-default'>
        <ul className='nav left-nav'>
          <li>
            <Link to={routes.specs(project)}>
              <FontAwesomeIcon icon={faCode} />{' '}
              Tests
            </Link>
          </li>
          <li>
            <Link to={routes.runs(project)}>
              <FontAwesomeIcon icon={faDatabase} />{' '}
              Runs
            </Link>
          </li>
          <li>
            <Link to={routes.settings(project)}>
              <FontAwesomeIcon icon={faCog} />{' '}
              Settings
            </Link>
          </li>
        </ul>
        <div className='spacer' />
        <Browsers project={project} />
      </nav>
    )
  }
}
