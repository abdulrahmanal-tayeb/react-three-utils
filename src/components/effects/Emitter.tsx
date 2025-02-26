import { PositionalAudio, useTexture, Image } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { createRef, ForwardedRef, forwardRef, isValidElement, useRef } from "react";
import { BufferGeometry, DoubleSide, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { SingleEmitterProps, Particle, EmitterProps } from "../../types/effects/Emitter";
import { easing } from "maath";
import { Group } from "three";
import { getRandomTexture } from "../../utils/helpers";


/**
 * Group of particle emitters.
 */
export const Emitter = forwardRef<Group, EmitterProps>(({
    // Shape and look
    count = 1,
    space = 0,
    curve = 0,

    // Transform
    position,
    scale,
    rotation,

    // Other Props
    emitter,
    delayEachEmission = 0,
}: EmitterProps, ref) => {
    if (!emitter?.particles) {
        throw Error(`You should specify the particle's textures list in "particles".`);
    }

    return (
        <group
            position={position}
            scale={scale}
            rotation={rotation}
            ref={ref}
        >
            {Array.from({ length: count }, (_, i) => {
                // Calculate the angle for this emitter.
                // Emitters are distributed evenly around 360 degrees (2π radians) plus an overall offset "curve".
                const angle = (i / count) * (2 * Math.PI) + curve;

                // Position each emitter on the circle. They share the same Y coordinate.
                const emitterPosition: [number, number, number] = [
                    space * Math.cos(angle),
                    0,
                    space * Math.sin(angle)
                ];

                // Set each emitter's rotation so that its "up" direction is perpendicular to the circle at that point.
                // Here, we assume the emitter's default forward is along the X axis, so we rotate it about Y.
                const emitterRotation: [number, number, number] = [
                    0,
                    angle + Math.PI / 2, // adjust as needed to orient correctly
                    0
                ];

                return (
                    <group
                        key={i}
                        position={emitterPosition}
                        rotation={emitterRotation}
                    >
                        <SingleEmitter
                            delay={delayEachEmission * (i + 1)}
                            {...emitter}
                        />
                    </group>
                );
            })}
        </group>
    );
});



/**
 * Emits **textures** particles to the world's upside direction.
 * @requires particles
 */
export const SingleEmitter = forwardRef(({
    // Emitter Props
    sound,
    enabled = true,
    emitterObject,
    delay = 0,
    delayCycle = 0,

    // Particle Props
    particles,
    speed = 0,
    deviateOn = 'x',
    distance = 1,
    particleWidth = 0.3,
    particleHeight = 0.3,

    // Callbacks and Events
    getDeviation,
    onParticleReset,
    onParticleEmit,
    onParticleUpdate
}: SingleEmitterProps, ref: ForwardedRef<Group>) => {

    /** 
     * Used to lock/unlock the emission of a particle (Useful in case of a delay) 
     */
    const emitRef = useRef<boolean>(true);


    /**
     * A reference to the emitter object
     */
    const emitterObjectRef = useRef<Group>(null);


    /**
     * Each particle's data and `reference`. However, this currently is a single texture whose
     * `map` is being changed, but for the futrue, this could include multiple particles that emit from 
     * the same emitter object!
     */
    const texturesRefs = useRef<Particle[]>([
        {
            reference: createRef<Mesh>()
        }
    ]);


    /**
     * Textures obtained from the paths.
     */
    const textures = useTexture(particles);


    useFrame((state, delta) => {
        const elapsed = state.clock.getElapsedTime();
        if (elapsed < delay) return;

        const particleSpeed = delta * Math.max(0, speed);
        // Precompute the deviation value if the function is provided
        const deviationValue = getDeviation ? getDeviation(elapsed) : null;
        const emitter = emitterObjectRef.current;
        const currentTexturesRefs = texturesRefs.current;

        // Reusable up vector for each iteration
        const up = new Vector3(0, 1, 0);

        if (enabled && emitRef.current) {
            if (currentTexturesRefs?.length > 0) {
                for (let i = 0; i < currentTexturesRefs.length; i++) {
                    const particleRef = currentTexturesRefs[i].reference;
                    const particle = particleRef.current;
                    if (!particle) continue;

                    onParticleUpdate && onParticleUpdate(particle, emitter);
                    // Reset up vector and apply parent's quaternion if available
                    up.set(0, 1, 0);
                    if (particle.parent) {
                        up.applyQuaternion(particle.parent.quaternion);
                    }

                    // Emit particle when starting from y === 0
                    if (particle.position.y === 0 && onParticleEmit) {
                        onParticleEmit(particle, emitter);
                    }

                    // Move particle along up vector and add extra vertical movement
                    particle.position.addScaledVector(up, particleSpeed);
                    particle.position.y += particleSpeed;


                    // Apply deviation if provided
                    if (deviationValue) {
                        easing.damp(
                            particle.position,
                            deviateOn,
                            deviationValue,
                            1,
                            particleSpeed
                        );
                    }

                    if (!Array.isArray(particle.material)) {
                        // Fade out particle after reaching halfway of the distance
                        if (particle.position.y > distance / 2) {
                            particle.material.opacity -= particleSpeed;
                        }
                        // Reset the particle if its opacity has dropped to 0 or below
                        if (particle.material.opacity <= 0) {
                            if (delayCycle > 0) {
                                emitRef.current = false;
                                setTimeout(() => (emitRef.current = true), delayCycle * 1000);
                            }
                            if (onParticleReset) {
                                onParticleReset(particle, emitter);
                            }
                            if ('map' in particle.material) {
                                particle.material.map = getRandomTexture(textures);
                            }
                            
                            particle.position.y = 0;
                            particle.material.opacity = 1;
                        }
                    }
                }
            }
        } else {
            // When not enabled or not emitting, reset all particles
            for (let i = 0; i < currentTexturesRefs.length; i++) {
                const particle = currentTexturesRefs[i].reference.current;
                if (particle) {
                    particle.position.y = 0;
                    if (!Array.isArray(particle.material))
                        particle.material.opacity = 1;
                }
            }
        }
    });

    return (
        <group ref={ref}>
            {isValidElement(emitterObject) &&
                <group ref={emitterObjectRef}>
                    {emitterObject}
                </group>
            }

            {texturesRefs.current.map(({ reference }, index) => (
                <mesh ref={reference}>
                    <Image
                        key={index}
                        transparent
                        side={DoubleSide}
                        url={particles?.[0] ?? ""}
                        scale={[particleWidth, particleHeight]}  // Width and height in 3D units
                    />
                </mesh>
            ))}

            {/* Enable Sound */}
            {sound && <PositionalAudio {...sound} />}
        </group>
    )
});