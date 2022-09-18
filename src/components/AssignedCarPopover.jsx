import { Block, f7, Popover } from 'framework7-react'
import React, { useEffect } from 'react'

const AssignedCarPopover = ({ selectedElevator, assignedCar, storePoints }) => {
  const points = selectedElevator == assignedCar ? 10 : 0

  useEffect(() => {
    f7.popover.open('.popover-assignedCar-result', '.assignedElevatorText')
  }, [])

  return (
    <Popover className="popover-assignedCar-result" slot="fixed" onPopoverClosed={() => storePoints(points)}>
      <Block inset>
        You have chosen the Schelevator {selectedElevator} and been assigned to {assignedCar}. You therefore receive {points} Points
      </Block>
    </Popover>
  )
}

export default AssignedCarPopover
