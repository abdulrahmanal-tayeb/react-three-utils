import { useFrame } from "@react-three/fiber";
import { ForwardedRef, forwardRef, isValidElement, useMemo, useRef } from "react";
import { Clock, Group } from "three";
import { AxisPredicateProps, AxisProps } from "../../types/common";
import { MotionProps } from "../../types/utilities/Motion";

type MotionsType = {
    value: undefined | AxisProps | AxisPredicateProps | number | ((clock: Clock) => number),
    property: string
};



/**
 * Take full control over the the object's `movement`, `rotation` and `scale`.
 */
export const Motion = forwardRef((
    {
        children,
        movement,
        rotation,
        scale
    }: MotionProps,
    ref: ForwardedRef<Group>
) => {
    const groupRef = useRef<Group>(null);
    const motions = useMemo(() => ([
        { value: movement, property: "position" },
        { value: rotation, property: "rotation" },
        { value: scale, property: "scale" },
    ])
        , [movement, rotation, scale]);

    const axes = useMemo(() => (["x", "y", "z"]), []);

    useFrame((state) => {
        if (!groupRef.current) return;
        const group = groupRef.current;

        const { clock } = state;

        motions.forEach(({ value, property }: MotionsType) => {
            if (value && typeof value === "object") {
                axes.forEach((axis) => {
                    const axisValue = value[axis];
                    if (axisValue != null) {
                        (group as any)[property][axis] +=
                            typeof axisValue === "function" ? axisValue(clock) : axisValue;
                    }
                });
            } else {
                const computed = typeof value === "function" ? value(clock) : value;
                if (computed) {
                    axes.forEach((axis) => {
                        (group as any)[property][axis] = computed;
                    });
                }
            }
        });
    });

    return (
        <group
            ref={(node) => {
                if (node) {
                    groupRef.current = node;
                    if (ref) {
                        if (typeof ref === "function") {
                            ref(node);
                        } else {
                            ref.current = node;
                        }
                    }
                }
            }}
        >
            {isValidElement(children) && children}
        </group>
    );
}) 