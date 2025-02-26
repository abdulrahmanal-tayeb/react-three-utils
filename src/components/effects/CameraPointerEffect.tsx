import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useRef } from "react";
import { Vector3 } from "three";


/**
 * Makes the camera look slightly at the pointer's position.
 */
export function CameraPointerEffect({
    speed = 1,
    influenceX = 0.5,
    influenceY = 1
}: {
    /**
     * The speed the effect will take to reach the end result.
     */
    speed?: number,


    /**
     * The influence on the X axis, the higher the wider the camera will able to look.
     */
    influenceX?: number,


    /**
     * The influence on the Y axis, the higher the higher the camera will able to look.
     */
    influenceY?: number
}) {
    // Ref to hold a temporary vector for computing the lookAt target
    const lookAtTarget = useRef(new Vector3());

    useFrame((state, delta) => {
        // 1. Damp the camera position on the X axis using pointer input.
        //    (Y and Z remain unchanged.)
        easing.damp3(
            state.camera.position,
            [
                state.pointer.x * influenceX,         // X: Scale pointer influence on X
                state.camera.position.y * influenceY,       // Y: Unchanged
                state.camera.position.z        // Z: Unchanged
            ],
            1,  // Damping factor for a smooth transition
            delta * speed
        );

        // 2. Compute a stable lookAt target that is based on the damped camera position,
        //    but with a subtle offset derived from the pointer.
        lookAtTarget.current.set(
            state.camera.position.x + state.pointer.x * 0.25,  // X: Add a smaller horizontal offset
            state.camera.position.y + state.pointer.y * 0.25,  // Y: Add a subtle vertical offset
            0                                                // Z: Fixed depth target (adjust if needed)
        );

        // Update the camera to look at the computed target.
        state.camera.lookAt(lookAtTarget.current);
    });

    return null;
}