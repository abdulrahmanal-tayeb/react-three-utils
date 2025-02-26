import { Clock } from "three";
import { AxisProps, ThreeObject } from "../common";
import { ReactElement, ReactNode } from "react";
import { Group } from "three";


export interface PointerProps {
    /**
     * Children :)
     */
    children?: ReactElement | ReactNode | ThreeObject,


    /**
     * How fast should the object move towards the pointer.
     * @default 1
     */
    speed?: number,


    /**
     * The offset from the target point.
     */
    offset?: AxisProps,


    /**
     * How far is the object from the camera.
     * @default 5
     */
    distance?: number,


    /**
     * Whether the object should update. This stops the object in its position if set to `false`
     * @default true
     */
    enabled?: boolean,


    /**
     * The object's position before it updates to the pointer's position. This is useful if you
     * want to start it off the screen instead of showing it in the center immediately.
     * 
     * @default - The center of the camera ~ [0, 0, 0]
     */
    startPos?: [number, number, number],


    /**
     * Should the object be shown on mobile devices (or a device with no pointer ~ touch screen?)
     */
    showOnTouchScreens?: boolean,


    /**
     * Called on every frame.
     */
    onUpdate?: (
        /**
         * The group that follows the pointer. (The children)
         */
        group: Group, 


        /**
         * The Three.js clock.
         */
        clock: Clock
    ) => void
}