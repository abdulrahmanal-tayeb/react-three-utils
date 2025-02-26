import { isValidElement, useMemo, useRef } from "react";
import { CollisionDetectorProps } from "../../types/effects/Collision";
import { useFrame } from "@react-three/fiber";
import { Box3 } from "three";
import { Group } from "three";


/**
 * Detects a collision of two objects speciefied by `first` and `second`
 */
export function CollisionDetector({
    first,
    second,
    triggerOnce,
    onCollission,
}: CollisionDetectorProps) {
    const collidedRef = useRef<boolean>(false);
    const mesh1Ref = useRef<Group>(null);
    const mesh2Ref = useRef<Group>(null);

    // Create bounding boxes once using useMemo
    const box1 = useMemo(() => new Box3(), []);
    const box2 = useMemo(() => new Box3(), []);

    useFrame(() => {
        if (!mesh1Ref.current || !mesh2Ref.current) return;

        // Update the boxes with current object data
        box1.setFromObject(mesh1Ref.current);
        box2.setFromObject(mesh2Ref.current);

        if (box1.intersectsBox(box2) && !collidedRef.current) {
            if (triggerOnce) {
                collidedRef.current = true;
            }
            onCollission && onCollission(mesh1Ref.current, mesh2Ref.current);
        }
    });

    return (
        <>
            {isValidElement(first) && (
                <group ref={mesh1Ref}>
                    {first}
                </group>
            )}
            {isValidElement(second) && (
                <group ref={mesh2Ref}>
                    {second}
                </group>
            )}
        </>
    );
}