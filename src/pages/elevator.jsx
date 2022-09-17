import { App, Button, f7 } from 'framework7-react'
import React, { useEffect, useRef, useState } from 'react'
import { AppState } from '../js/appState'
import ElevatorSVG from './elevatorsvg'

const Elevator = (props) => {
  const prevState = useRef()
  useEffect(() => {
    const leftDoor = f7.$('#door-left')
    const rightDoor = f7.$('#door-right')
    leftDoor?.removeAttr('class')
    rightDoor?.removeAttr('class')

    switch (props.appState) {
      case AppState.ChooseDestination:
        break
      case AppState.GuessDoor:
        break
      case AppState.FeelingLucky:
        leftDoor.addClass('door-left-open')
        rightDoor.addClass('door-right-open')
        leftDoor.addClass('door-left-stay-open')
        rightDoor.addClass('door-right-stay-open')
        break
      case AppState.GoToDestination:
        leftDoor.addClass('door-left-close')
        rightDoor.addClass('door-right-close')
        break
      case AppState.RandomiseDestination:
        break
      case AppState.WalkStairs:
        break
      case AppState.ArrivedAtDestination:
        leftDoor.addClass('door-left-open')
        rightDoor.addClass('door-right-open')
        break

      default:
        break
    }
    prevState.current = props.appState
  })
  /*
  const toggleDoor = () => {
    console.log(closed)
    leftDoor.removeAttribute('class')
    rightDoor.removeAttribute('class')

    if (closed) {
      leftDoor.classList.add('door-left-close')
      rightDoor.classList.add('door-right-close')
      setOpen(false)
    } else {
      leftDoor.classList.add('door-left-open')
      rightDoor.classList.add('door-right-open')
      setOpen(true)
      leftDoor.classList.add('door-left-stay-open')
      rightDoor.classList.add('door-right-stay-open')
    }
  } */

  return (
    <React.Fragment>
      <ElevatorSVG height={props.height} />
    </React.Fragment>
  )
}

export default Elevator
