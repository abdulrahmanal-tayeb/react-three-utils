import { RefObject, useRef } from "react";
import { Box3, Group } from "three";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";


/**
 * Detects a collision of two objects.
 */
export function useCollisionDetection({
    first,
    second,
    triggerOnce,
    onCollission
}: {
    /**
     * The first object reference
     */
    first: RefObject<Mesh | Group>,


    /**
     * The second object reference
     */
    second: RefObject<Mesh | Group>,


    /**
     * Trigger only once
     */
    triggerOnce?: boolean,


    /**
     * Gets called when a collision happens.
     */
    onCollission: (first: Mesh | Group, second: Mesh | Group) => void
}) {

    const box1 = useRef<Box3>(new Box3());
    const box2 = useRef<Box3>(new Box3());

    const collidedRef = useRef<boolean>(false);
    useFrame(() => {
        // Ensure both meshes are mounted
        if (!first.current || !second.current) return;

        // Create bounding boxes for each mesh
        box1.current.setFromObject(first.current);
        box2.current.setFromObject(second.current);

        // Check if the bounding boxes intersect (collision)
        if (box1.current.intersectsBox(box2.current) && !collidedRef.current) {
            if (triggerOnce) {
                collidedRef.current = true;
            }
            onCollission && onCollission(first.current, second.current);
        }
    });

    return null;
}


export function isColliding(
    first: Mesh | Group,
    second: Mesh | Group
) {

    if(!first || !second) return false;

    // Create bounding boxes for each mesh
    const box1 = new Box3().setFromObject(first);
    const box2 = new Box3().setFromObject(second);

    return box1.intersectsBox(box2);
}