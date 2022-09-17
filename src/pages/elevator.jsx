import { Button } from 'framework7-react';
import React, { useRef, useState } from 'react';
import ElevatorSVG from './elevatorsvg';

const Elevator = () => {

  const elevatorsvg = useRef(null);

  const doorRight =  document.getElementById("DoorRight");
  const doorLeft = document.getElementById("DoorLeft");

  console.log(doorRight)

  const moveLeftStep = .001;
  const moveRightStep = .0008;

  const requestRef = useRef();
  const previousTimeRef = useRef();

  const [closedLeft, setClosedLeft] = useState(false);
  const [closedRight, setClosedRight] = useState(false);
  const [curXRight, setCurXRight] = useState(3.609);
  const [curXLeft, setCurXLeft] = useState(2.009);  
  const [animationInterval, setAnimationInterval] = useState(null);


  const animateClose = (time, cb) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;

      if( curXRight > 3.609 ){
        doorRight.setAttribute("transform", `matrix(${curXRight},0,0,4.48096,-3278.93,-2744.44)`);
        setCurXRight(curXRight  - moveLeftStep);
      } else {
        setClosedRight(true);
      }

            
      if(curXLeft < 2.009){
        doorLeft.setAttribute("transform", `matrix(${curXLeft},0,0,1.63938,-1083.06,-629.391)`);
        setCurXLeft(curXLeft + moveRightStep);

        } else {
            setClosedLeft(true);
        }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animateClose);
  }

  const animateOpen = (time, cb) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
 
      if(curXRight<3.76368){
        doorRight.setAttribute("transform", `matrix(${curXRight},0,0,4.48096,-3278.93,-2744.44)`);
        setCurXRight(curXRight  + moveLeftStep);
    } else {
        setClosedRight(false);
    }

    
    if(curXLeft > 1.88184 ){
        doorLeft.setAttribute("transform", `matrix(${curXLeft},0,0,1.63938,-1083.06,-629.391)`);
        setCurXLeft(curXLeft - moveRightStep);
    } else {
        setClosedLeft(false);
    }

    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animateClose);
  }



  
  return (
    <React.Fragment>
      <Button fill onClick={animateOpen}>open</Button>
      <Button fill onClick={animateClose}>close</Button>
      <ElevatorSVG/>
    </React.Fragment>
  );
}

export default Elevator;
