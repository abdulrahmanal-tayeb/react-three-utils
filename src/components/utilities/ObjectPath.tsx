import { useEffect, useState } from "react";
import { CatmullRomCurve3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { Line } from "./Line";
import { ObjectPathProps } from "../../types/utilities/ObjectPath";


/**
 * Defines a path for an object to follow.
 * 
 * This is useful when you want to animate an object in a non-standard way.
 * 
 * **The object will animate automatically on scroll, if you want to manually control it
 * you can use the `progress` prop to provide a value between 0 - 1**
 * 
 * Notes:
 * - It is important to wrap this component with a `ScrollControls` from **react-three/drei**.
 * - If you want to pass an object instead of a reference to it in the `object` prop, pass it to the `{current: <object_here>}`.
 */
export function ObjectPath({
    followQuaternion = true,
    points,
    object,
    debug,
    lineProps,
    curveProps,
    progress
}: ObjectPathProps) {
    const [path, setPath] = useState<CatmullRomCurve3 | null>(null);
    const scroll = useScroll();

    useEffect(() => {
        if (points) {
            setPath(
                new CatmullRomCurve3(points, curveProps?.closed, (curveProps?.curveType) ?? 'catmullrom', (curveProps?.tension) ?? 0.5)
            );
        }
    }, [points]);


    useFrame(() => {
        if (!path) return;
        if (object?.current) {
            const animationProgress = Math.min(1, Math.max(0, progress ?? scroll.offset));

            // Compute the current position along the curve
            const currentPos = path.getPointAt(animationProgress);
            object.current.position.copy(currentPos);

            // Optionally orient the camera along the curve direction
            if (followQuaternion) {
                // Look a bit ahead along the curve.
                const lookAheadT = Math.min(animationProgress + 0.01, 1);
                const nextPos = path.getPointAt(lookAheadT);
                object.current.lookAt(nextPos);
            }
        }
    });


    return debug && points ? (
        <Line
            points={points}
            lineProps={lineProps}
        />
    ) : null;
}