import { f7 } from 'framework7-react'
import React, { useEffect, useRef, useState } from 'react'
import { AppState } from '../js/appState'
import ElevatorSVG from './elevatorsvg'

const Elevator = (props) => {
  const [appState, setAppState] = useState(props.appState)
  const prevState = useRef()
  console.log(appState)
  useEffect(() => {
    const leftDoor = f7.$('#door-left')
    const rightDoor = f7.$('#door-right')
    const elevatorIndicator = document.getElementById('elevator-indicator')

    switch (appState.toString()) {
      case AppState.ChooseDestination.toString():
        leftDoor?.removeAttr('class')
        rightDoor?.removeAttr('class')
        break
      case AppState.GuessDoor.toString():
        break
      case AppState.FeelingLucky.toString():
        leftDoor.addClass('door-left-open')
        rightDoor.addClass('door-right-open')
        leftDoor.addClass('door-left-stay-open')
        rightDoor.addClass('door-right-stay-open')

        elevatorIndicator.style.display = 'block'
        break
      case AppState.GoToDestination.toString():
        leftDoor.addClass('door-left-close')
        rightDoor.addClass('door-right-close')
        elevatorIndicator.style.display = 'none'
        break
      case AppState.RandomiseDestination.toString():
        leftDoor.addClass('door-left-close')
        rightDoor.addClass('door-right-close')
        elevatorIndicator.style.display = 'none'
        break
      case AppState.WalkStairs.toString():
        leftDoor.addClass('door-left-open')
        rightDoor.addClass('door-right-open')
        leftDoor.addClass('door-left-stay-open')
        rightDoor.addClass('door-right-stay-open')
        elevatorIndicator.style.display = 'none'
        break
      case AppState.ArrivedAtDestination.toString():
        leftDoor.addClass('door-left-open')
        rightDoor.addClass('door-right-open')
        leftDoor.addClass('door-left-stay-open')
        rightDoor.addClass('door-right-stay-open')
        elevatorIndicator.style.display = 'none'
        break

      default:
        break
    }
    prevState.current = props.appState
  })

  return (
    <React.Fragment>
      <ElevatorSVG height={props.height} />
      <span id={'elevator-indicator'} className={'elevator-indicator'}>
        {props.assignedCar}
      </span>
    </React.Fragment>
  )
}

export default Elevator
