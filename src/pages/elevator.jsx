import {f7} from 'framework7-react';
import React, {useEffect, useRef} from 'react';
import {AppState} from '../js/appState';
import ElevatorSVG from './elevatorsvg';

const Elevator = (props) => {
    const prevState = useRef();
    useEffect(() => {
        const leftDoor = f7.$('#door-left');
        const rightDoor = f7.$('#door-right');
        const elevatorIndicator = document.getElementById("elevator-indicator");

        leftDoor?.removeAttr('class');
        rightDoor?.removeAttr('class');

        switch (props.appState) {
            case AppState.ChooseDestination:
                break;
            case AppState.GuessDoor:
                break;
            case AppState.FeelingLucky:
                leftDoor.addClass('door-left-open');
                rightDoor.addClass('door-right-open');
                leftDoor.addClass('door-left-stay-open');
                rightDoor.addClass('door-right-stay-open');
                elevatorIndicator.style.display = 'block';
                break;
            case AppState.GoToDestination:
                leftDoor.addClass('door-left-close');
                rightDoor.addClass('door-right-close');
                elevatorIndicator.style.display = 'none';
                break;
            case AppState.RandomiseDestination:
                leftDoor.addClass('door-left-close');
                rightDoor.addClass('door-right-close');
                elevatorIndicator.style.display = 'none';
                break;
            case AppState.WalkStairs:
                leftDoor.addClass('door-left-open');
                rightDoor.addClass('door-right-open');
                leftDoor.addClass('door-left-stay-open');
                rightDoor.addClass('door-right-stay-open');
                elevatorIndicator.style.display = 'none';
                break;
            case AppState.ArrivedAtDestination:
                leftDoor.addClass('door-left-open');
                rightDoor.addClass('door-right-open');
                leftDoor.addClass('door-left-stay-open');
                rightDoor.addClass('door-right-stay-open');
                elevatorIndicator.style.display = 'none';
                break;

            default:
                break;
        }
        prevState.current = props.appState;
    });

    return (
        <React.Fragment>
            <ElevatorSVG height={props.height}/>
            <span id={"elevator-indicator"} className={"elevator-indicator"}>A</span>
        </React.Fragment>
    );
};

export default Elevator;
