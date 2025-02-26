import { useFrame } from "@react-three/fiber";
import { isValidElement, useLayoutEffect, useMemo, useRef } from "react";
import { Group, Vector3 } from "three";
import { SlideProps } from "../../types/animators/Slide";


/**
 * Slides a component from a point in space (or a direction) to its current position.
 */
export function Slide({
    children,
    direction,
    distanceFromTarget = 1,
    from,
    speed = 0,
    animateScale,
    delay,
    enabled,
    onComplete
}: SlideProps) {
    /**
     * Whether the object has reached its target position.
     */
    const reachedTarget = useRef<boolean>(!!delay);

    /**
     * Target position
     */
    const target = useRef<Vector3>(new Vector3(0, 0, 0));


    /**
     * The group that will wrap the children to animate them.
     */
    const groupRef = useRef<Group>(null);


    /**
     * The initial distance from the source to the target before animating.
     */
    const initialDistance = useRef<number>(0);


    /**
     * The object's start position from which it will animate.
     */
    const startPos = useMemo<[number, number, number]>(() => {
        return from || (distanceFromTarget ? (
            [
                direction === "left" ? distanceFromTarget : direction === "right" ? -distanceFromTarget : 0,
                direction === "down" ? distanceFromTarget : direction === "up" ? -distanceFromTarget : 0,
                direction === "out" ? distanceFromTarget : direction === "in" ? -distanceFromTarget : 0,
            ]
        ) : [0, 0, 0]);
    }, [from, direction]);


    useLayoutEffect(() => {
        if (delay) {
            setTimeout(() => {
                reachedTarget.current = false;
            }, delay * 1000);
        } else {
            reachedTarget.current = false;
        }
    }, [delay]);


    useFrame((state, delta) => {
        if (!enabled || reachedTarget.current || !groupRef.current) return;

        // Compute initialDistance once when available.
        if (initialDistance.current === 0) {
            initialDistance.current = groupRef.current.position.distanceTo(target.current);
        }

        const distance = groupRef.current.position.distanceTo(target.current);
        if (distance < 0.1) {
            reachedTarget.current = true;

            if (animateScale) {
                groupRef.current.scale.set(1, 1, 1);
            }
            return onComplete && onComplete(groupRef.current);
        }

        // Calculate progress as a value from 0 to 1.
        let progress = 1 - distance / initialDistance.current;
        progress = Math.min(Math.max(progress, 0), 1);

        if (animateScale) {
            // If animateScale is a number, use it as the starting scale; otherwise default to 0.
            const startScale = typeof animateScale === "number" ? animateScale : 0;
            // Animate from startScale to 1 based on progress.
            const scale = startScale + progress * (1 - startScale);
            groupRef.current.scale.set(scale, scale, scale);
        }

        groupRef.current.position.lerp(target.current, delta * (2 + speed));
    });


    return (
        <group
            ref={groupRef}
            position={startPos}
            scale={(typeof animateScale === "number" ? animateScale : undefined)}
        >
            {isValidElement(children) && children}
        </group>
    );
}