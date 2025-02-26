import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AxisProps, PositionedObject } from "../../types/common";
import { Camera, Matrix4, Quaternion, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraControlsProps, CameraFocusable } from "../../types/hooks/Camera";
import { getOffset } from "../hooks/utils";


/**
 * Control the camera position as easy as calling the `focusOn` function.
 */
export function useCameraControls({
    camera,
    speed = 0.1,
    lookAtTarget = false,
    offset: { x: defaultOffsetX = 0, y: defaultOffsetY = 0, z: defaultOffsetZ = 0 } = {},
}: CameraControlsProps = {}) {
    const { set, invalidate, camera: defaultCamera } = useThree();
    const [activeCam, setActiveCam] = useState<Camera>(camera ?? defaultCamera);
    const [focusTarget, setFocusTarget] = useState<CameraFocusable>();

    /**
     * Those are temporary created stores to prevent allocating/deallocating memory in every frame.
     */
    const tempTargetPos = useRef(new Vector3());
    const tempLookAt = useRef(new Vector3());
    const tempOffset = useRef(new Vector3());
    const tempMatrix = useRef(new Matrix4());
    const tempQuat = useRef(new Quaternion());


    /**
     * Compute the offset of the current snap here to avoid every frame calculation.
     */
    const computedOffset = useMemo(() => {
        return getOffset(focusTarget?.offset, {
            x: defaultOffsetX,
            y: defaultOffsetY,
            z: defaultOffsetZ,
        });
    }, [focusTarget?.offset, defaultOffsetX, defaultOffsetY, defaultOffsetZ]);


    useFrame(() => {
        if (!focusTarget || !focusTarget.object || !activeCam) return;

        if (focusTarget.object instanceof Vector3) {
            tempTargetPos.current.copy(focusTarget.object);
        } else if (focusTarget.object.getWorldPosition) {
            focusTarget.object.getWorldPosition(tempTargetPos.current);
        }

        tempOffset.current.copy(computedOffset);
        tempTargetPos.current.add(tempOffset.current);

        activeCam.position.lerp(tempTargetPos.current, speed);

        if (lookAtTarget && focusTarget.lookAt) {
            if (focusTarget.lookAt instanceof Vector3) {
                tempLookAt.current.copy(focusTarget.lookAt);
            } else if (focusTarget.lookAt.getWorldPosition) {
                focusTarget.lookAt.getWorldPosition(tempLookAt.current);
            }

            tempMatrix.current.lookAt(activeCam.position, tempLookAt.current, activeCam.up);
            tempQuat.current.setFromRotationMatrix(tempMatrix.current);

            activeCam.quaternion.slerp(tempQuat.current, speed * 2);
        }
    });


    /**
     * Smoothly focuses the camera to the target
     */
    const focusOn = useCallback(
        (
            object: PositionedObject,
            {
                offset: { x: offsetX = 0, y: offsetY = 0, z: offsetZ = 0 } = {},
                lookAt,
            }: {
                /**
                 * An object, or a point, to where the camera should look
                 * 
                 * Defaults to the target itself.
                 */
                lookAt?: PositionedObject;


                /**
                 * Offset of the camera from the target object
                 */
                offset?: AxisProps;
            } = {}
        ) => {
            if (object) {
                setFocusTarget({
                    offset: { x: offsetX, y: offsetY, z: offsetZ },
                    lookAt,
                    object,
                });
            }
        },
        []
    );


    /**
     * This controls what camera is set as active.
     */
    useEffect(() => {
        const cam = camera || activeCam;
        if (cam) {
            set({ camera: cam } as any);
            if (camera && cam !== activeCam) {
                setActiveCam(camera);
            }
            invalidate();
        }
    }, [camera, activeCam, set, invalidate]);

    return {
        /**
         * Focus on an object.
         */
        focusOn,

        /**
         * Set the active camera.
         */
        setActiveCam,
    };
}



