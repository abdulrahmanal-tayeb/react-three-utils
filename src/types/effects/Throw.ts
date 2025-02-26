import { ReactNode } from "react";
import { Camera, Clock, Group } from "three";
import { Mesh } from "three";

interface Velocity {
    /**
     * Velocity in the x axis
     */
    x?: number;


    /**
     * Velocity in the y axis.
     */
    y?: number;


    /**
     * Velocity in the z axis.
     */
    z?: number;
}

export interface ThrowProps {
    /**
     * The source to be thrown from.
     */
    children?: Mesh | Group | ReactNode;



    /**
     * Whether the object should throw objects.
     */
    enabled?: boolean;

    /**
     * The source to be thrown from.
     */
    source?: Mesh | Group | Camera | null;



    /**
     * The direction of the thrown object.
     */
    velocity?: Velocity | ((clock: Clock) => [number, number, number]);


    /**
     * How far the object should travel before it disappears.
     */
    travelDistance?: number;


    /**
     * How long before emitting the next object.
     */
    interval?: number;


    /**
     * The object to be thrown.
     */
    object?: Mesh | Group;


    /**
     * Gets called for each object on each frame.
     */
    onUpdate?: (
        /**
         * The object being animated.
         */
        object: Mesh | Group,



        /**
         * The progress of its animation (from 0 to 1) where 0 is the start and 1 is the end.
         */
        progress: number
    ) => void


    /**
     * Gets called when an object is spawned.
     */
    onSpawn?: () => void



    /**
     * Gets called when an object is disposed.
     */
    onDispose?: () => void
}

