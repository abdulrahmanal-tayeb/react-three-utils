import { ReactNode } from "react";
import { BaseAnimationProps } from "./base";
import { Group } from "three";
import { Mesh } from "three";


export interface SlideProps extends BaseAnimationProps {
    /**
     * The object to be animated.
     */
    children: Mesh | Group | ReactNode,


    /**
     * The direction towards which the object will animate.
     */
    direction?: "up" | "down" | "left" | "right" | "in" | "out",


    /**
     * A point in 3D space relative to the object towards which the object will start **from**.
     */
    from?: [number, number, number],


    /**
     * The distance from the object's origin it will start from 
     */
    distanceFromTarget?: number,


    /**
     * The starting scale of the object, it will animate to the original scale of the object
     * as the object approaches the target.
     * 
     * It can take the following forms:
     * - `boolean`: if true, the object will start at scale `0` and will animate to `1`.
     * - `number`: the object will start at that scale and will animate to `1`.
     */
    animateScale?: number | boolean
}