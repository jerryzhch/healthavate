import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavRight,
  Link,
  Block,
  Button,
  Range,
  Segmented,
  Swiper,
  SwiperSlide,
  f7,
  App,
  Icon,
  Fab,
  FabButton,
  FabButtons,
  FabBackdrop,
} from 'framework7-react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { ElevatorMatrix } from '../js/elevatorMatrix'
import { AppState } from '../js/appState'
import Elevator from './elevator'

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [socketUrl, setSocketUrl] = useState('wss://hack.myport.guide')
  const [messageHistory, setMessageHistory] = useState([])
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl)
  const [activeButton, setActiveButton] = useState(ElevatorMatrix.ElevatorA)
  const [appState, setAppState] = useState(localStorage.getItem('appState') || AppState.ChooseDestination)
  const [currentFloorLevel, setCurrentFloorLevel] = useState(0)
  const [elevatorDestination, setElevatorDestination] = useState('')

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage))
    }
  }, [lastMessage])

  useEffect(() => {
    console.dir(messageHistory)
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage))
    }
  }, [lastMessage, setMessageHistory])

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  const elevatorFloorSelected = (floor) => {
    if (floor != currentFloorLevel) openActionsPopover('Confirm Destination level: ', floor, AppState.GuessDoor)
  }
  const load = () => {
    handleClickSendMessage()
    if (isLoading) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 4000)
  }

  const handleClickSendMessage = useCallback(
    () =>
      sendMessage(
        JSON.stringify({
          Method: 'SUBSCRIBE',
          asyncId: 1,
          'Request-URI': '/topic/liftState/',
        })
      ),
    []
  )

  const activateElevatorButton = (selectedElevator) => {
    openActionsPopover('Confirm Schelevator selection: ', selectedElevator, AppState.FeelingLucky)
    makeElevatorReservation()
    setActiveButton(selectedElevator)
  }

  const openActionsPopover = (infoText, val, nextState) => {
    const actionsToPopover = f7.actions.create({
      buttons: [
        {
          text: infoText + val,
          label: true,
          bold: true,
        },
        {
          text: 'Confirm',
          bold: true,
          color: 'green',
          onClick: () => {
            if (appState == AppState.ChooseDestination) setElevatorDestination(`Floor ${val}`)
            setNewAppState(nextState)
          },
        },
        {
          text: 'Cancel',
          color: 'red',
          onClick: () => {
            f7.range.get('.elevator-level-slider').setValue(currentFloorLevel)
          },
        },
      ],
      // Need to specify popover target
      targetEl: '.elevator-level-slider',
    })
    actionsToPopover.open()
  }

  const feelingLucky = () => {
    f7.fab.close()
    setNewAppState(AppState.RandomiseDestination)
  }

  const normalOperation = () => {
    f7.fab.close()
    setNewAppState(AppState.GoToDestination)
  }

  const setNewAppState = (newAppState) => {
    localStorage.setItem('appState', newAppState)
    setAppState(newAppState)
  }

  const randomId = () => Math.random().toString(36).substring(2) || '0'

  const makeElevatorReservation = useCallback(() => {
    console.log('Make A Elevator Reservation')
    sendMessage(
      JSON.stringify({
        Method: 'POST',
        asyncId: randomId(),
        'Request-URI': '/publish/',
        'body-json': {
          asyncId: `${randomId()}`,
          options: {
            destination: {
              destinationFloor: -1,
            },
          },
          target: {
            floor: 0,
          },
        },
      })
    )
  }, [])

  return (
    <Page name="home" className="homePage">
      {/* Top Navbar */}
      <Navbar sliding={true}>
        <NavLeft>
          <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="left" />
        </NavLeft>
        <NavTitle sliding>Healthavate</NavTitle>
        <NavRight>
          <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="right" />
        </NavRight>
      </Navbar>

      <FabBackdrop slot="fixed" />
      {/* Page content */}
      <Block style={{ margin: '0', height: '20%' }} className="display-flex" strong>
        {/*<img src={'../assets/images/speak-bubble.svg'} alt="speak-bubble-border" />*/}
        <p className="speak-bubble">{f7.store.state.bubbleTexts.find((el) => el.id == appState).description}</p>
        <img className="the-dude" src={'images/thedude.svg'} alt="TheDude" />
      </Block>
      <Block className="display-flex justify-content-center align-items-center" style={{ height: '65%', margin: 0, gap: '10px' }}>
        {/*<Button className="findElevatorBtn" fill large preloader loading={isLoading} onClick={load} disabled={readyState !== ReadyState.OPEN}>
          Choose your destination level <i className="f7-icons">arrowtriangle_right</i>
          </Button>*/}

        <Elevator height={'80%'} appState={appState} />

        <Range
          className="elevator-level-slider"
          style={{ height: '80%', margin: 0, marginLeft: '11px' }}
          vertical={true}
          min={-1}
          max={10}
          label={true}
          step={1}
          disabled={appState != AppState.ChooseDestination}
          value={currentFloorLevel}
          scale={true}
          onRangeChanged={(val) => elevatorFloorSelected(val)}
          scaleSteps={11}
          scaleSubSteps={1}
        />
      </Block>
      <Block style={{ margin: '0', height: '15%' }} strong>
        {appState == AppState.GuessDoor && (
          <Segmented strong tag="p">
            <Button large active={ElevatorMatrix.ElevatorA === activeButton} onClick={() => activateElevatorButton(ElevatorMatrix.ElevatorA)}>
              A
            </Button>
            <Button large active={ElevatorMatrix.ElevatorB === activeButton} onClick={() => activateElevatorButton(ElevatorMatrix.ElevatorB)}>
              B
            </Button>
            <Button large active={ElevatorMatrix.ElevatorC === activeButton} onClick={() => activateElevatorButton(ElevatorMatrix.ElevatorC)}>
              C
            </Button>
            <Button large active={ElevatorMatrix.ElevatorD === activeButton} onClick={() => activateElevatorButton(ElevatorMatrix.ElevatorD)}>
              D
            </Button>
          </Segmented>
        )}
        {appState > AppState.FeelingLucky && (
          <Swiper effect="coverflow" direction="vertical" style={{ height: '100%' }}>
            <SwiperSlide>Your Destination: {elevatorDestination}</SwiperSlide>
          </Swiper>
        )}  
      </Block>

      {appState == AppState.FeelingLucky && (
        <Fab position="center-bottom" slot="fixed" text="Choose Action">
          <Icon f7="bolt_fill"></Icon>
          <Icon f7="bolt_horizontal_fill"></Icon>
          <FabButtons position="top">
            <FabButton label="Feeling Lucky" onClick={feelingLucky}></FabButton>
            <FabButton label="Not Today" onClick={normalOperation}></FabButton>
          </FabButtons>
        </Fab>
      )}
      {/*
    <List>
      <ListItem
        title="Dynamic (Component) Route"
        link="/dynamic-route/blog/45/post/125/?foo=bar#about"
      />
      <ListItem
        title="Default Route (404)"
        link="/load-something-that-doesnt-exist/"
      />
      <ListItem
        title="Request Data & Load"
        link="/request-and-load/user/123456/"
      />
    </List>
*/}
    </Page>
  )
}
export default HomePage
