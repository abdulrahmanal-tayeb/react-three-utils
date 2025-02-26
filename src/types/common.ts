import { PositionalAudio } from "@react-three/drei";
import { ComponentProps, ReactNode } from "react";
import { Clock, Vector3 } from "three";
import { Group, Mesh } from "three";
type PositionalAudioProps = ComponentProps<typeof PositionalAudio>;

export interface SoundProps extends PositionalAudioProps {}


/**
 * Used in any Three.js object
 */
export interface TransformProps {
    position?: [number, number, number],
    rotation?: [number, number, number],
    scale?: [number, number, number],
}



export type ThreeObject = ReactNode | Mesh | Group;
export type PositionedObject = Mesh | Group | Vector3 | null;


export interface AxisProps {
    [key: string]: any,
    x?: number,


    y?: number,


    z?: number
}


export interface AxisPredicateProps {
    [key: string]: any,
    x?: (clock: Clock) => number,
    y?: (clock: Clock) => number,
    z?: (clock: Clock) => number,
}