import React, { Component } from 'react'
import { observer } from 'mobx-react'
import TimerStore from './duration-timer-store'
import { faHourglassHalf } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

@observer
export default class TimerDisplay extends Component {
  constructor (...props) {
    super(...props)

    this.timerStore = new TimerStore(this.props.startTime)
  }

  componentDidMount () {
    this.timerStore.startTimer()
  }

  componentWillUnmount () {
    this.timerStore.resetTimer()
  }

  render () {
    return (
      <span className='env-duration'>
        <FontAwesomeIcon icon={faHourglassHalf} />
        {this.timerStore.mainDisplay}
      </span>
    )
  }
}
