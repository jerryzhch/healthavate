import React, { useEffect, useState, useCallback } from 'react'
import { Page, Navbar, NavLeft, NavTitle, NavTitleLarge, NavRight, Link, Toolbar, Block, Button, Range, Segmented } from 'framework7-react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { ElevatorMatrix } from '../js/lift'

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [socketUrl, setSocketUrl] = useState('wss://hack.myport.guide')
  const [messageHistory, setMessageHistory] = useState([])
  const [activeButton, setActiveButton] = useState(ElevatorMatrix.ElevatorA)

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl)
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage))
    }
  }, [lastMessage, setMessageHistory])

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
    setActiveButton(selectedElevator)
  }
  return (
    <Page name="home" className='homePage'>
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
      {/* Page content */}
      <Block style={{ margin: '0', height: '15vh' }} strong>
        <p>Welcome to Healthavate, a fun and interactive app to elevate the elevator experience (get it ;)?).</p>
      </Block>
      <Block className="display-flex justify-content-center align-items-center" style={{ height: '65vh', margin: 0, gap: '10px' }}>
        <Button className="findElevatorBtn" te fill preloader loading={isLoading} onClick={load} disabled={readyState !== ReadyState.OPEN}>
          Find Schindler Elevator
        </Button>
        <Range className="" style={{ height: '60vh', margin: 0 }} vertical={true} min={-1} max={10} label={true} step={1} value={1} />
      </Block>
      <Block style={{ margin: '0', height: '13vh' }} strong>
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
        {/*
        <div>The WebSocket is currently {connectionStatus}</div>
        {lastMessage ? <div>Last message: {lastMessage.data}</div> : null}
        <ul>
          {messageHistory.map((message, idx) => (
            <div key={idx}>{message ? message.data : null}</div>
          ))}
        </ul> */}
      </Block>

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
