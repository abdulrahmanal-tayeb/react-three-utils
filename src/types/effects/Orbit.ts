import { ReactNode } from "react";
import { Clock, Group, Mesh } from "three";
import { ThreeObject } from "../common";


export type OrbitProps = OrbitBaseProps & OrbitCallbacks;


export interface OrbitBaseProps {
    /**
     * List of objects that will orbit the center
     */
    objects: Array<ThreeObject>,

    /**
     * The origin around which the orbit will move.
     */
    children?: ReactNode | Mesh | Group,

    /**
     * How wide is the orbit around the center.
     */
    radius: number
}


export interface OrbitCallbacks {
    /**
     * Called on each frame
     * @param orbit The orbit group
     * @param center The center
     * @param clock The clock
     */
    onUpdate?: (orbit: Group, center: Group, clock: Clock) => void,

    
    /**
     * Returns the angle of each object, and where it is positioned in the circular orbit.
     */
    getAngle?: (index: number, object: ThreeObject, objects: Array<ThreeObject>) => number
}