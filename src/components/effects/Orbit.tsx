import { ForwardedRef, forwardRef, isValidElement, useRef } from "react";
import { OrbitProps } from "../../types/effects/Orbit";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

export const Orbit = forwardRef((
    {
        // Props
        objects,
        children,
        radius = 10,

        // Callbacks
        onUpdate,
        getAngle
    }: OrbitProps,
    ref: ForwardedRef<Group>
) => {

    const objectsRef = useRef<Group>(null);
    const centerRef = useRef<Group>(null);

    useFrame(({ clock }) => {
        if (objectsRef.current && centerRef.current && onUpdate) {
            onUpdate(objectsRef.current, centerRef.current, clock);
        }
    });

    return (
        <group
            ref={ref}
        >
            <group ref={centerRef}>
                {isValidElement(children) && children}
            </group>
            <group ref={objectsRef}>
                {objects.map((object, index) => {
                    // Compute the angle for this sphere based on its index.
                    const angle = getAngle ? getAngle(index, object, objects) : (index / objects.length) * Math.PI * 2;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;

                    return isValidElement(object) && (
                        <group key={index} position={[x, 0, z]}>
                            {object}
                        </group>
                    );
                })}
            </group>
        </group>
    );
}) ;