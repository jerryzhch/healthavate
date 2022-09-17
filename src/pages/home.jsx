import React, {useCallback, useEffect, useState} from 'react';
import {
    Block,
    Button,
    f7,
    Fab,
    FabBackdrop,
    FabButton,
    FabButtons,
    Icon,
    Link,
    Navbar,
    NavLeft,
    NavRight,
    NavTitle,
    Page,
    Range,
    Segmented,
    Swiper,
    SwiperSlide,
} from 'framework7-react';
import useWebSocket, {ReadyState} from 'react-use-websocket';
import {ElevatorMatrix} from '../js/elevatorMatrix';
import {AppState} from '../js/appState';
import Elevator from './elevator';

const HomePage = () => {
    const [socketUrl, setSocketUrl] = useState('wss://hack.myport.guide');
    const [messageHistory, setMessageHistory] = useState([]);
    const {sendMessage, lastMessage, readyState} = useWebSocket(socketUrl);
    const [activeButton, setActiveButton] = useState(ElevatorMatrix.ElevatorA);
    const [appState, setAppState] = useState(localStorage.getItem('appState') || AppState.ChooseDestination);
    const [currentFloorLevel, setCurrentFloorLevel] = useState(0);
    const [elevatorDestination, setElevatorDestination] = useState(0);

    const [assignedCar, setAssignedCar] = useState(null);

    useEffect(() => {
        messageHistory.map(m => console.log(JSON.parse(m.data)));
        if (lastMessage !== null) {
            let lastMesageData = JSON.parse(lastMessage.data);
            if (lastMesageData.hasOwnProperty("data")) {
                if (lastMesageData.data.hasOwnProperty("allocation")) {
                    setAssignedCar(lastMesageData.data.allocation.car.name);
                }
            }
            setMessageHistory((prev) => prev.concat(lastMessage));
        }
    }, [lastMessage, setMessageHistory]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    const elevatorFloorSelected = (floor) => {
        if (floor != currentFloorLevel) openActionsPopover('Confirm Destination level: ', floor, AppState.GuessDoor);
    };


    const activateElevatorButton = (selectedElevator) => {
        openActionsPopover('Confirm Schelevator selection: ', selectedElevator, AppState.FeelingLucky);
        setActiveButton(selectedElevator);
    };

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
                        if (appState == AppState.ChooseDestination) setElevatorDestination(val);
                        setNewAppState(nextState);
                        makeElevatorReservation();
                    },
                },
                {
                    text: 'Cancel',
                    color: 'red',
                    onClick: () => {
                        f7.range.get('.elevator-level-slider').setValue(currentFloorLevel);
                    },
                },
            ],
            // Need to specify popover target
            targetEl: '.elevator-level-slider',
        });
        actionsToPopover.open();
    };

    const feelingLucky = () => {
        f7.fab.close();
        const MIN_FLOOR = -1;
        const MAX_FLOOR = 10;
        let lowEnd = 0;
        let highEnd = 0;
        if (currentFloorLevel < elevatorDestination) {
            lowEnd = currentFloorLevel;
            highEnd = elevatorDestination;
        } else {
            highEnd = currentFloorLevel;
            lowEnd = elevatorDestination;
        }
        let list = [];
        for (let i = lowEnd; i <= highEnd; i++) {
            if (lowEnd ==
                i && i > MIN_FLOOR) {
                list.push(i - 1);
                continue;
            }
            if (i == highEnd && i < MAX_FLOOR) {
                list.push(i + 1);
                continue;
            }
            list.push(i);
        }
        const randomnFloor = list[Math.floor(Math.random() * list.length)];
        setElevatorDestination(randomnFloor);
        f7.range.get('.elevator-level-slider').setValue(randomnFloor);

        setNewAppState(AppState.RandomiseDestination);
    };

    const normalOperation = () => {
        f7.fab.close();
        setNewAppState(AppState.GoToDestination);
    };

    const setNewAppState = (newAppState) => {

        if (newAppState == 3) {
            if (currentFloorLevel < elevatorDestination) {
                f7.$("#indicator-up").removeClass("indicator-off");
            } else {
                f7.$("#indicator-down").removeClass("indicator-off");
            }
        }

        if (newAppState == 7) {
            f7.$("#indicator-up").addClass("indicator-off");
            f7.$("#indicator-down").addClass("indicator-off");
        }

        localStorage.setItem('appState', newAppState);
        setAppState(newAppState);
    };

    const randomId = () => Math.random().toString(36).substring(2) || '0';

    const makeElevatorReservation = useCallback(() => {
        sendMessage(
            JSON.stringify({
                Method: 'POST',
                asyncId: randomId(),
                'Request-URI': '/publish/',
                'body-json': {
                    asyncId: `${randomId()}`,
                    options: {
                        destination: {
                            destinationFloor: elevatorDestination,
                        },
                    },
                    target: {
                        floor: currentFloorLevel,
                    },
                },
            })
        );
    }, [elevatorDestination]);

    return (
        <Page name="home" className="homePage">
            {/* Top Navbar */}
            <Navbar sliding={true}>
                <NavLeft>
                    <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="left"/>
                </NavLeft>
                <NavTitle sliding>Healthavate</NavTitle>
                <NavRight>
                    <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="right"/>
                </NavRight>
            </Navbar>

            <FabBackdrop slot="fixed"/>
            {/* Page content */}
            <Block style={{margin: '0', height: '20%'}} strong>
                <div className={"speak-bubble"}>{/* className="display-flex"  */}
                    <h3 className="speak-bubble-title">{f7.store.state.bubbleTexts.find((el) => el.id == appState).title}</h3>
                    <p className="speak-bubble-text">{f7.store.state.bubbleTexts.find((el) => el.id == appState).description}</p>
                </div>
                <img className="the-dude" src={'images/thedude.svg'} alt="TheDude"/>
            </Block>
            <Block className="display-flex justify-content-center align-items-center"
                   style={{height: '65%', margin: 0, gap: '10px'}}>
                {/*<Button className="findElevatorBtn" fill large preloader loading={isLoading} onClick={load} disabled={readyState !== ReadyState.OPEN}>
          Choose your destination level <i className="f7-icons">arrowtriangle_right</i>
          </Button>*/}

                <Elevator height={'80%'} appState={appState}/>

                <Range
                    className="elevator-level-slider"
                    style={{height: '80%', margin: 0, marginLeft: '11px'}}
                    vertical={true}
                    min={-1}
                    max={10}
                    label={true}
                    step={1}
                    disabled={appState != AppState.ChooseDestination}
                    value={currentFloorLevel}
                    scale={true}
                    onRangeChanged={(val) => (appState != AppState.FeelingLucky) ? elevatorFloorSelected(val) : ""}
                    scaleSteps={11}
                    scaleSubSteps={1}
                />
            </Block>
            <Block style={{margin: '0', height: '15%'}} strong>
                {appState == AppState.GuessDoor && (
                    <Segmented strong tag="p" className={"segmented-buttons"}>
                        <Button large active={ElevatorMatrix.ElevatorA === activeButton}
                                onClick={() => activateElevatorButton(ElevatorMatrix.ElevatorA)}>
                            A
                        </Button>
                        <Button large active={ElevatorMatrix.ElevatorB === activeButton}
                                onClick={() => activateElevatorButton(ElevatorMatrix.ElevatorB)}>
                            B
                        </Button>
                        <Button large active={ElevatorMatrix.ElevatorC === activeButton}
                                onClick={() => activateElevatorButton(ElevatorMatrix.ElevatorC)}>
                            C
                        </Button>
                        <Button large active={ElevatorMatrix.ElevatorD === activeButton}
                                onClick={() => activateElevatorButton(ElevatorMatrix.ElevatorD)}>
                            D
                        </Button>
                    </Segmented>
                )}
                {appState > AppState.FeelingLucky && (
                    <Swiper effect="coverflow" direction="vertical" style={{height: '100%'}}>
                        <SwiperSlide className={"end-swiper"}>Your Destination: {elevatorDestination}</SwiperSlide>
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

        </Page>
    );
};
export default HomePage;
