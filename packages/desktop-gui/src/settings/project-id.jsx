import { observer } from 'mobx-react'
import React from 'react'
import Tooltip from '@cypress/react-tooltip'

import ipc from '../lib/ipc'
import { configFileFormatted } from '../lib/config-file-formatted'
import { faClipboard, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const openProjectIdHelp = (e) => {
  e.preventDefault()
  ipc.externalOpen('https://on.cypress.io/what-is-a-project-id')
}

const ProjectId = observer(({ project }) => {
  if (!project.id) return null

  const projectIdJsonConfig = {
    projectId: project.id,
  }

  return (
    <div data-cy="project-id">
      <a href='#' className='learn-more' onClick={openProjectIdHelp}>
        <FontAwesomeIcon icon={faInfoCircle} />{' '}
        Learn more
      </a>
      <p className='text-muted'>This projectId should be in your {configFileFormatted(project.configFile)} and checked into source control.
        It identifies your project and should not be changed.
      </p>
      <pre className='line-nums copy-to-clipboard'>
        <a className="action-copy" onClick={() => ipc.setClipboardText(JSON.stringify(projectIdJsonConfig, null, 2))}>
          <Tooltip
            title='Copy to clipboard'
            placement='top'
            className='cy-tooltip'
          >
            <FontAwesomeIcon icon={faClipboard} />
          </Tooltip>
        </a>
        <span>{'{'}</span>
        <span>{`  "projectId": "${project.id}"`}</span>
        <span>{'}'}</span>
      </pre>
    </div>
  )
})

export default ProjectId
