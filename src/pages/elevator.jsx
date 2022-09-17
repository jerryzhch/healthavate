import { Button } from 'framework7-react';
import React, { useEffect, createRef, useRef, useState } from 'react';
import f7 from 'framework7-react';

const Elevator = () => {

  const elevatorsvg = useRef(null);

  const doorRight =  elevatorsvg.current?.value;
  const doorLeft = elevatorsvg.current?.value;

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
      
      // Pass on a function to the setter of the state
      // to make sure we always have the latest state

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

    /*
    if(closedLeft && closedRight){
        clearInterval(animationInterval);
        animationInterval = null;
    }
    */



    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animateClose);
  }

  const animateOpen = (time, cb) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      
      // Pass on a function to the setter of the state
      // to make sure we always have the latest state

      if(curXRight<3.76368){
        doorRight.setAttribute("transform", `matrix(${curXRight},0,0,4.48096,-3278.93,-2744.44)`);
        setCurXRight(curXRight  + moveLeftStep);
    } else {
        setClosedRight(false);
    }

    
    if(curXLeft > 1.88184 ){

        doorLeft.setAttribute("transform", `matrix(${curXLeft},0,0,1.63938,-1083.06,-629.391)`);
        //curXLeft = curXLeft - moveRightStep;
        setCurXLeft(curXLeft - moveRightStep);
    } else {
        setClosedLeft(false);
    }
/*
    if(!closedLeft && !closedRight){
        clearInterval(animationInterval);
        animationInterval  = null;
    }*/



    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animateClose);
  }

/*
  const animateClose = () => {
                  
      if(curXRight>3.609){
          doorRight.setAttribute("transform", `matrix(${curXRight},0,0,4.48096,-3278.93,-2744.44)`);
          curXRight = curXRight  - moveLeftStep;
      } else {
          closedRight = true;
      }

      
      if(curXLeft < 2.009){

          doorLeft.setAttribute("transform", `matrix(${curXLeft},0,0,1.63938,-1083.06,-629.391)`);
          curXLeft = curXLeft + moveRightStep;
      } else {
          closedLeft = true;
      }

      if(closedLeft && closedRight){
          clearInterval(animationInterval);
          animationInterval = null;
      }
  }*/
/*
  const animateOpen = () => {
              
    if(curXRight<3.76368){
        doorRight.setAttribute("transform", `matrix(${curXRight},0,0,4.48096,-3278.93,-2744.44)`);
        curXRight = curXRight  + moveLeftStep;
    } else {
        closedRight = false;
    }

    
    if(curXLeft > 1.88184 ){

        doorLeft.setAttribute("transform", `matrix(${curXLeft},0,0,1.63938,-1083.06,-629.391)`);
        curXLeft = curXLeft - moveRightStep;
    } else {
        closedLeft = false;
    }

    if(!closedLeft && !closedRight){
        clearInterval(animationInterval);
        animationInterval  = null;
    }
    }     */

/*
    const closeDoors = () => {
      animationInterval = setInterval(()=>{ 
        
        // requestAnimationFrame( () => animateClose() ) }, 10);

        useAnimationFrame( () => animateClose() )

            }, 10      
            )
          }
*/
/*
  const openDoors = () => {
      animationInterval = setInterval(()=>{ 
        
        //requestAnimationFrame( () => animateOpen() ) 
        useAnimationFrame( () => animateOpen() )

      }, 10);
  }*/



  
  return (
    <React.Fragment>
      <Button fill onClick={animateOpen}>open</Button>
      <Button fill onClick={animateClose}>close</Button>
      <img ref={elevatorsvg} src={'../assets/images/elevator.svg'} alt="ElevatorSVG"/>
    </React.Fragment>
  );
}

export default Elevator;
