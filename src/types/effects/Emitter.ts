import { ReactElement, RefObject } from "react";
import { BufferGeometry, Mesh, MeshStandardMaterial, Group, Material } from "three";
import { ImageProps } from "@react-three/drei";
import { SoundProps, TransformProps } from "../common";


export type TextureRef = RefObject<Mesh<BufferGeometry, MeshStandardMaterial> | null>;

export type SingleEmitterProps = SingleEmitterBaseProps & EmitterCallbacks;

export type EmitterProps = EmitterBaseProps & TransformProps;

export type EmitterBaseCallback = (
    /**
     * The particle that is currently active
     */
    particle: Mesh, 


    /**
     * The emitter object
     */
    emitter: Group | null
) => void;



export interface EmitterBaseProps {
    /**
     * Number of emitters
     */
    count?: number,

    /**
     * Space between each emitter in world units
     */
    space?: number,

    /**
     * Emitter curve relative to its origin
     */
    curve?: number,

    /**
     * Each emitter props (Same as `SingleEmitter`'s props)
     */
    emitter?: SingleEmitterProps,

    /**
     * Delays each emitter emission relative to its prior one.
     */
    delayEachEmission?: number,
}


export interface SingleEmitterBaseProps {
    /**
     * List of images (Textures) paths. Accepts all `Three.js` supported image types.
     */
    particles: Array<string>,

    /**
     * `PositionalSound` props.
     * 
     *  Accepts all props that a `PositionalSound` component supports from `react-three/drei`
     */
    sound?: SoundProps | undefined,


    /**
     * Whether the emitter should animate particles or not.
     */
    enabled?: boolean,


    /**
     * How far should the particle travel before it fades out.
     */
    distance?: number,


    /**
     * How fast should the particle travel.
     */
    speed?: number,


    /**
     * On what axis should the particle deviate. `getDeviation` must be defined.
     */
    deviateOn?: 'x' | 'y' | 'z',

    /**
     * The object that emits the particles. If mesh is provided, then the particles emits 
     * from an invisible object.
     */
    emitterObject?: ReactElement | Mesh<BufferGeometry, MeshStandardMaterial>,


    /**
     * Particle image width.
     */
    particleWidth?: number,

    
    /**
     * Particle image height.
     */
    particleHeight?: number,


    /**
     * How long should the emitter wait before starting to emit the particles **for the first time**
     */
    delay?: number,


    /**
     * How long should the emitter wait before emitting the next particle.
     */
    delayCycle?: number
}


export interface EmitterCallbacks {
    /**
     * Called when a particle begin to go upwards. Its `y` position changes from 0 to another value.
     */
    onParticleEmit?: EmitterBaseCallback,


    /**
     * Called when a particle resets to its original position (Finished animating)
     */
    onParticleReset?: EmitterBaseCallback,


    /**
     * Called on each frame as long as the emitter is enabled.
     */
    onParticleUpdate?: EmitterBaseCallback,

    /**
     * Deviates the particle on the given axis.
     * @param clock The Three.js clock from the `useFrame`'s `state`.
     * @returns The deviation amount on the specified axis (From the `deviateOn` prop)
     */
    getDeviation?: (clock: number) => number
}


/**
 * Each particle has those attibutes.
 */
export interface Particle {
    id?: number, // ID to be able to differentiate between each when animating them.
    reference: RefObject<Mesh | null>
}