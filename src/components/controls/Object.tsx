import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AxisProps, PositionedObject } from "../../types/common";
import { Group, Matrix4, Mesh, Quaternion, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { getOffset } from "../hooks/utils";
import { ObjectControlsProps, ObjectFocusable } from "../../types/hooks/Object";
import { isColliding } from "../hooks/Collision";


/**
 * Controls an object position as easy as calling the `focusOn` function.
 */
export function useObjectControls({
    object,
    speed = 0.1,
    lookAtTarget = false,
    followQuaternion,
    onIntersection,
    offset: { x: defaultOffsetX = 0, y: defaultOffsetY = 0, z: defaultOffsetZ = 0 } = {},
}: ObjectControlsProps = {}) {
    const [source, setSource] = useState<Mesh | Group>();
    const [focusTarget, setFocusTarget] = useState<ObjectFocusable>();


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
        if (!focusTarget || !focusTarget.object || !source) return;

        if (focusTarget.object instanceof Vector3) {
            tempTargetPos.current.copy(focusTarget.object);
        } else if (focusTarget.object.getWorldPosition) {
            focusTarget.object.getWorldPosition(tempTargetPos.current);
        }

        tempOffset.current.copy(computedOffset);
        tempTargetPos.current.add(tempOffset.current);
        source.position.lerp(tempTargetPos.current, speed);

        if (lookAtTarget && focusTarget.lookAt) {
            if (focusTarget.lookAt instanceof Vector3) {
                tempLookAt.current.copy(focusTarget.lookAt);
            } else if (focusTarget.lookAt.getWorldPosition) {
                focusTarget.lookAt.getWorldPosition(tempLookAt.current);
            }

            tempMatrix.current.lookAt(source.position, tempLookAt.current, source.up);
            tempQuat.current.setFromRotationMatrix(tempMatrix.current);

            source.quaternion.slerp(tempQuat.current, speed * 2);
        }

        if (followQuaternion) {
            // Make the source follow the quaternion of the target
            // Only attempt this if the focus target object has a quaternion property
            if ('quaternion' in focusTarget.object && focusTarget.object.quaternion) {
                source.quaternion.slerp(focusTarget.object.getWorldQuaternion(new Quaternion()), speed * 2);
            }
        }

        if (onIntersection && !(focusTarget.object instanceof Vector3)) {
            if (isColliding(source, focusTarget.object)) {
                onIntersection(source, focusTarget.object);
            }
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
        if (object) {
            setSource(object);
        }
    }, [object]);


    return {
        /**
         * Focuses an object to another one.
         */
        focusOn,
    };
}