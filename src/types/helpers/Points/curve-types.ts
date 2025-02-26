import * as THREE from "three";

export type Vector3Like = THREE.Vector3 | [number, number, number];
export type CurveType =
    | "linear" | "sine" | "spiral" | "arc" | "bezier"
    | "ellipse" | "polygon" | "star" | "helix" | "parametric"
    | "lissajous" | "superformula" | "polyline" | "rectangle"
    | "cube" | "cylinder" | "torus" | "rose" | string; // Allow string extensions


export interface CurveConfigBase {
    type: CurveType;
    segments?: number;
    closed?: boolean;
    smoothness?: number;
}
// 1. Linear
export interface LinearConfig extends CurveConfigBase {
    type: "linear";
    /** Starting point of the line in 3D space [x, y, z] */
    start?: Vector3Like;
    /** Ending point of the line in 3D space [x, y, z] */
    end?: Vector3Like;
    /** Amount of random displacement (0-1) to add along the line */
    noise?: number;
}

// 2. Sine
export interface SineConfig extends CurveConfigBase {
    type: "sine";
    /** Axis along which the sine wave oscillates (x/y/z) */
    axis?: "x" | "y" | "z";
    /** Peak deviation from central axis */
    amplitude?: number;
    /** Number of complete wave cycles */
    frequency?: number;
    /** Horizontal shift of the wave pattern (radians) */
    phase?: number;
    /** Total length of the wave path */
    length?: number;
}

// 3. Spiral
export interface SpiralConfig extends CurveConfigBase {
    type: "spiral";
    /** Central axis of the spiral (x/y/z) */
    axis?: "x" | "y" | "z";
    /** Distance from center to spiral path */
    radius?: number;
    /** Vertical distance between spiral start and end */
    height?: number;
    /** Number of complete rotations */
    turns?: number;
    /** Rotation direction (true = clockwise) */
    clockwise?: boolean;
}

// 4. Superformula
export interface SuperformulaConfig extends CurveConfigBase {
    type: "superformula";
    /** Symmetry parameter (controls number of "petals") */
    m?: number;
    /** First shape parameter */
    n1?: number;
    /** Second shape parameter */
    n2?: number;
    /** Third shape parameter */
    n3?: number;
    /** Overall scaling factor */
    scale?: number;
}

// 5. Arc
export interface ArcConfig extends CurveConfigBase {
    type: "arc";
    /** Center point of the arc [x, y, z] */
    center?: Vector3Like;
    /** Distance from center to arc path */
    radius?: number;
    /** Starting angle in radians */
    startAngle?: number;
    /** Ending angle in radians */
    endAngle?: number;
    /** Plane for 2D arc (xy/xz/yz) */
    plane?: "xy" | "xz" | "yz";
}

// 6. Bezier
export interface BezierConfig extends CurveConfigBase {
    type: "bezier";
    /** Control points for cubic Bezier curve (minimum 4 points) */
    points?: Vector3Like[];
}

// 7. Ellipse
export interface EllipseConfig extends CurveConfigBase {
    type: "ellipse";
    /** Center point [x, y, z] */
    center?: Vector3Like;
    /** Horizontal radius */
    xRadius?: number;
    /** Vertical radius */
    yRadius?: number;
    /** Rotation angle in radians */
    rotation?: number;
    /** Plane for 2D ellipse (xy/xz/yz) */
    plane?: "xy" | "xz" | "yz";
}

// 8. Polygon
export interface PolygonConfig extends CurveConfigBase {
    type: "polygon";
    /** Number of sides */
    sides?: number;
    /** Distance from center to vertices */
    radius?: number;
    /** Center point [x, y, z] */
    center?: Vector3Like;
    /** Rotation angle in radians */
    rotation?: number;
    /** Plane for 2D polygon (xy/xz/yz) */
    plane?: "xy" | "xz" | "yz";
}

// 9. Star
export interface StarConfig extends CurveConfigBase {
    type: "star";
    /** Number of points */
    points?: number;
    /** Distance from center to inner valleys */
    innerRadius?: number;
    /** Distance from center to outer points */
    outerRadius?: number;
    /** Center point [x, y, z] */
    center?: Vector3Like;
    /** Rotation angle in radians */
    rotation?: number;
    /** Plane for 2D star (xy/xz/yz) */
    plane?: "xy" | "xz" | "yz";
}

// 10. Helix
export interface HelixConfig extends CurveConfigBase {
    type: "helix";
    /** Radius of helical path */
    radius?: number;
    /** Vertical distance between coils */
    height?: number;
    /** Number of complete rotations */
    turns?: number;
    /** Rotation direction (true = clockwise) */
    clockwise?: boolean;
}

// 11. Parametric
export interface ParametricConfig extends CurveConfigBase {
    type: "parametric";
    /** Function that returns [x,y,z] given parameter t */
    fn?: (t: number) => Vector3Like;
    /** Range for parameter t [start, end] */
    range?: [number, number];
}

// 12. Lissajous
export interface LissajousConfig extends CurveConfigBase {
    type: "lissajous";
    /** Frequency ratio in x-axis */
    a?: number;
    /** Frequency ratio in y-axis */
    b?: number;
    /** Phase difference between axes (radians) */
    delta?: number;
    /** Overall scaling factor */
    size?: number;
}

// 13. Polyline
export interface PolylineConfig extends CurveConfigBase {
    type: "polyline";
    /** Array of connected vertices [x,y,z] */
    points?: Vector3Like[];
}

// 14. Rectangle
export interface RectangleConfig extends CurveConfigBase {
    type: "rectangle";
    /** Horizontal dimension */
    width?: number;
    /** Vertical dimension */
    height?: number;
    /** Center point [x, y, z] */
    center?: Vector3Like;
    /** Plane for 2D rectangle (xy/xz/yz) */
    plane?: "xy" | "xz" | "yz";
}

// 15. Cube
export interface CubeConfig extends CurveConfigBase {
    type: "cube";
    /** Edge length */
    size?: number;
    /** Center point [x, y, z] */
    center?: Vector3Like;
}

// 16. Cylinder
export interface CylinderConfig extends CurveConfigBase {
    type: "cylinder";
    /** Base radius */
    radius?: number;
    /** Height from base to top */
    height?: number;
}

// 17. Torus
export interface TorusConfig extends CurveConfigBase {
    type: "torus";
    /** Distance from center to tube center */
    majorRadius?: number;
    /** Radius of the tube itself */
    minorRadius?: number;
    /** Number of segments around major radius */
    majorSegments?: number;
    /** Number of segments around minor radius */
    minorSegments?: number;
}

// 18. Rose
export interface RoseConfig extends CurveConfigBase {
    type: "rose";
    /** Number of petals (if odd) or twice petals (if even) */
    petals?: number;
    /** Maximum petal length from center */
    length?: number;
}

// Union type for all configurations
export type CurveConfig =
    | LinearConfig
    | SineConfig
    | SpiralConfig
    | SuperformulaConfig
    | ArcConfig
    | BezierConfig
    | EllipseConfig
    | PolygonConfig
    | StarConfig
    | HelixConfig
    | ParametricConfig
    | LissajousConfig
    | PolylineConfig
    | RectangleConfig
    | CubeConfig
    | CylinderConfig
    | TorusConfig
    | RoseConfig
    | { [key: string]: any }; // Allow custom configs