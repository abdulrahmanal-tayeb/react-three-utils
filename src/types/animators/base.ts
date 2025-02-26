import { Group, Mesh } from "three";

export interface BaseAnimationProps {
    /**
     * The speed of the animation.
     */
    speed?: number;


    /**
     * Allow the animation to progress
     * @default true
     */
    enabled?: boolean;

    /**
     * The amount in seconds the animation should be delayed.
     */
    delay?: number;


    /**
     * Gets called once the animation reaches its target.
     */
    onComplete?: (
        /**
         * The reference to the animated object.
         */
        ref: Mesh | Group
    ) => void;   
}