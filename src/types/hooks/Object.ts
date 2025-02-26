import { Group, Mesh } from "three"
import { AxisProps, PositionedObject } from "../common"

export interface ObjectFocusable {
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


export interface ObjectControlsProps {
    /**
     * The camera that is to be controlled. **Note that it will be set as the default camera**
     */
    object?: Mesh | Group | null


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


    /**
     * Whether the source should follow the target's quaternion.
     */
    followQuaternion?: boolean,


    /**
     * 
     */
    onIntersection?: (source: Mesh | Group, target: Mesh | Group) => void

}