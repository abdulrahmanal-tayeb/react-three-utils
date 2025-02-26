import { useFrame } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import { isValidElement, useMemo, useRef } from 'react';
import { easing } from "maath";
import { PointerProps } from "../../types/utilities/Pointer";
import { isTouchDevice } from "../../utils/helpers";



/**
 * Make **any** object follow the pointer while taking full control over
 * its position, offset and other properties.
 */
export function Pointer({
    children,
    speed = 1,
    offset,
    distance = 5,
    enabled = true,
    startPos = [0, 0, 0],
    showOnTouchScreens = true,

    onUpdate
}: PointerProps) {
    const group = useRef<Group>(null);
    const shouldBeDisplayed = useMemo<boolean>(() => (showOnTouchScreens || isTouchDevice()), [showOnTouchScreens]);

    const tempMouseVec = useRef(new Vector3());
    const tempDirVec = useRef(new Vector3());
    const tempTargetVec = useRef(new Vector3());

    
    useFrame((state, delta) => {
        if (shouldBeDisplayed && group.current && enabled) {
            const { x, y } = state.pointer;

            // Use the ref vector for pointer coordinates (in NDC)
            tempMouseVec.current.set(x, y, 0);
            // Convert the pointer's NDC to world space coordinates
            tempMouseVec.current.unproject(state.camera);

            // Calculate the direction from the camera to the pointer position
            tempDirVec.current
                .copy(tempMouseVec.current)
                .sub(state.camera.position)
                .normalize();

            // Compute the target position: camera position plus the direction scaled by distance.
            // We use clone() here so that multiplying the direction doesn't affect tempDirVec.
            tempTargetVec.current
                .copy(state.camera.position)
                .add(tempDirVec.current.clone().multiplyScalar(distance));

            // Optionally add a fixed offset
            if (offset) {
                tempTargetVec.current.x += offset.x ?? 0;
                tempTargetVec.current.y += offset.y ?? 0;
                tempTargetVec.current.z += offset.z ?? 0;
            }

            // Smooth the group's position toward the target using damping
            easing.damp3(
                group.current.position,
                tempTargetVec.current,
                0.2,
                delta * speed
            );

            if (onUpdate) onUpdate(group.current, state.clock);
        }
    });


    return shouldBeDisplayed ? (
        <group
            position={startPos}
            ref={group}
        >
            {isValidElement(children) && children}
        </group>
    ) : null;
}