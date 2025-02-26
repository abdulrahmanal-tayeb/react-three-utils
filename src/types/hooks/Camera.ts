import { Camera } from "three";
import { AxisProps, PositionedObject } from "../common";

export interface CameraFocusable {
    /**
     * The object or point the camera will look at as it travels to the target.
     */
    lookAt?: PositionedObject,


    /**
     * Camera position offsets from the target position.
     */
    offset?: AxisProps,


    /**
     * The object the camera will focus on.
     */
    object: PositionedObject
}


export interface CameraControlsProps {
    /**
     * The camera that is to be controlled. **Note that it will be set as the default camera**
     */
    camera?: Camera | null,


    /**
     * How fast should the camera travel to the target.
     * @default 0.1
     */
    speed?: number,


    /**
     * Should the camera look at the target?
     * 
     * @default true
     */
    lookAtTarget?: boolean,


    offset?: AxisProps

}