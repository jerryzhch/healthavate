import React, { useEffect, useState, useCallback } from 'react'
import { Page, Navbar, NavLeft, NavTitle, NavTitleLarge, NavRight, Link, Toolbar, Block, Button } from 'framework7-react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [socketUrl, setSocketUrl] = useState('wss://hack.myport.guide')
  const [messageHistory, setMessageHistory] = useState([])

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
  return (
    <Page name="home">
      {/* Top Navbar */}
      <Navbar largeTransparent sliding={true}>
        <NavLeft>
          <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="left" />
        </NavLeft>
        <NavTitle sliding>Healthavate</NavTitle>
        <NavRight>
          <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="right" />
        </NavRight>
        <NavTitleLarge>Healthavate</NavTitleLarge>
      </Navbar>
      {/* Toolbar */}
      <Toolbar bottom></Toolbar>
      {/* Page content */}
      <Block strong>
        <p>Welcome to Healthavate, a fun and interactive app to elevate the elevator experience (get it ;)?).</p>
      </Block>
      <Block>
        <Button className="findElevatorBtn" te fill preloader loading={isLoading} onClick={load} disabled={readyState !== ReadyState.OPEN}>
          Find Schindler Elevator
        </Button>
        <div>The WebSocket is currently {connectionStatus}</div>
        {lastMessage ? <div>Last message: {lastMessage.data}</div> : null}
        <ul>
          {messageHistory.map((message, idx) => (
            <div key={idx}>{message ? message.data : null}</div>
          ))}
        </ul>
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
