import { Line as DLine } from "@react-three/drei";
import { ForwardedRef, forwardRef, isValidElement, useMemo } from "react";
import { LineProps } from "../../types/utilities/Line";
import { CatmullRomCurve3, Shape, Group } from "three";


/**
 * Simplifies drawing a line, extruding it and controlling it.
 */
export const Line = forwardRef((
    {
        extrude,
        center,
        points,
        closed,
        lineProps,
        children
    }: LineProps,
    ref: ForwardedRef<Group>
) => {

    // Create curve from points
    const curve = useMemo(() => {
        return new CatmullRomCurve3(
            points,
            closed,  // Closed curve
            'catmullrom',  // Curve type
            0.5  // Tension
        );
    }, [points, closed]);


    const shape = useMemo(() => {
        if (!extrude) return null;
        const { x = 0, y = 0, startX = 0, startY = 0 } = extrude;
        const shape = new Shape();

        // Here I am aware that I am using `Y` values in `X` parameters, but it works
        // as expected though ;)


        // Start at the given origin.
        shape.moveTo(startY, startX);

        // Horizontal line: extend from startX by x.
        shape.lineTo(startY + y, startX);

        // Vertical line: from there, extend vertically by y.
        shape.lineTo(startY + y, startX + x);

        // Horizontal line back: from there, go back to the original x position.
        shape.lineTo(startY, startX + x);

        // Close the shape.
        shape.closePath();

        return shape;
    }, [extrude]);


    return (
        <group
            ref={ref}
            position={
                (center && extrude) ?
                    [
                        (extrude.x ?? 0) / 2,
                        (extrude.y ?? 0) / 2,
                        0
                    ]
                    :
                    undefined
            }
        >
            {
                (extrude && shape) ?
                    <mesh>
                        <extrudeGeometry
                            args={[
                                shape,
                                {
                                    steps: extrude.steps,
                                    bevelEnabled: true,
                                    extrudePath: curve,
                                    ...(extrude.props ?? {})
                                }
                            ]}
                        />
                        {isValidElement(children) && children}
                    </mesh>
                    :
                    <DLine
                        points={points}
                        {...lineProps as any}
                    />
            }
        </group>
    );
});
