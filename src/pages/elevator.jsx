import { App, Button, f7 } from 'framework7-react'
import React, { useEffect, useRef, useState } from 'react'
import { AppState } from '../js/appState'
import ElevatorSVG from './elevatorsvg'

const Elevator = (props) => {
  const prevState = useRef()
  useEffect(() => {
    //assign the ref's current value to the count Hook
    prevState.current = props.appState
  }) //run this code when the value of count changes
  const leftDoor = f7.$('#door-left')
  const rightDoor = f7.$('#door-right')
  leftDoor?.removeAttr('class')
  rightDoor?.removeAttr('class')
  if (props.appState != AppState.FeelingLucky) {
    console.log(props.appState)
    leftDoor.addClass('door-left-close')
    rightDoor.addClass('door-right-close')
  } else {
    leftDoor.addClass('door-left-open')
    rightDoor.addClass('door-right-open')
    leftDoor.addClass('door-left-stay-open')
    rightDoor.addClass('door-right-stay-open')
  }
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
