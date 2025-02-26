import { Clock } from "three";
import { AxisPredicateProps, AxisProps, ThreeObject } from "../common";

export interface MotionProps {
    /**
     * Any children :)
     */
    children: ThreeObject,


    /**
     * Controls the **movements** of the children in each axis
     * 
     * You can use:
     * - A predicate, which will return the movement of the object on all axes
     * - The object method to change or mutate the movement on each axis individually.
     */
    movement?: AxisProps | AxisPredicateProps,


    /**
     * Controls the **rotation** of the children in each axis.
     * 
     * You can use:
     * - A predicate, which will return the rotation of the object on all axes
     * - The object method to change or mutate the rotation on each axis individually.
     */
    rotation?: AxisProps | AxisPredicateProps,


    /**
     * Controls the **scale** of the children in each axis.
     * 
     * You can use:
     * - A scalar value, which will define the scale on all axes.
     * - A predicate, which will return the scale of the object on all axes
     * - The object method to change or mutate the scale on each axis individually.
     */
    scale?: AxisProps | AxisPredicateProps | number | ((clock: Clock) => number)
}
