import * as THREE from "three";
import { CurveConfig, CurveType } from "types/helpers/Points/curve-types";
import { registerDefaultCurves } from "types/helpers/Points/helpers";
// import { CurveConfig, CurveType } from "../../types/utilities/Points/curve-types";
// import { registerDefaultCurves } from "../../types/utilities/Points/helpers";


type CurveGenerator<T extends CurveConfig> = (config: T) => THREE.Vector3[];


/**
 * This is to store a curve name - generator function of each curve.
 */
const registry = new Map<CurveType, CurveGenerator<any>>();


/**
 * If future curve types are to be added, this registers them in the registry.
 */
export function registerCurveType<T extends CurveConfig>(
    type: CurveType,
    generator: CurveGenerator<T>
) {
    registry.set(type, generator);
}



/**
 * Returns an array of points of a predefined, but customizable, shapes that can be passed
 * directly to a `CatmullRomCurve3` to create a ready path.
 */
export function createSmartCurve(config: CurveConfig): THREE.Vector3[] {
    const generator = registry.get(config.type);
    if (!generator) throw new Error(`Unregistered curve type: ${config.type}`);

    const rawPoints = generator(config);
    return config.smoothness ? smoothPoints(rawPoints, config) : rawPoints;
}


function smoothPoints(points: THREE.Vector3[], config: CurveConfig) {
    const curve = new THREE.CatmullRomCurve3(points, config.closed);
    return curve.getPoints(Math.max(points.length * (config.smoothness || 1) * 10, 20));
}


// Auto-register when imported
registerDefaultCurves();