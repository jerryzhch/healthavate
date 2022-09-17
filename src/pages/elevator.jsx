import { Button } from 'framework7-react';
import React, { useState } from 'react';
import ElevatorSVG from './elevatorsvg';

const Elevator = () => {

  const [open, setOpen] = useState(false);


  const leftDoor = document.getElementById("door-left");
  const rightDoor = document.getElementById("door-right");

  const toggleDoor = () => {

    console.log(open);
    leftDoor.removeAttribute('class');
    rightDoor.removeAttribute('class');
    
    if(open){

      leftDoor.classList.add("door-left-close");
      rightDoor.classList.add("door-right-close");
      setOpen(false);
    }else{
      leftDoor.classList.add("door-left-open");
      rightDoor.classList.add("door-right-open");
      setOpen(true);  
      leftDoor.classList.add("door-left-stay-open");
      rightDoor.classList.add("door-right-stay-open");
    }

  }
  


  return (
      <React.Fragment>
        <Button fill onClick={toggleDoor}></Button>
      <ElevatorSVG/>
      </React.Fragment>
      
  );
}

export default Elevator;
