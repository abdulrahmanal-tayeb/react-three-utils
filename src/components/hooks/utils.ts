import { Vector3 } from "three";

/**
 * Returns the offsets values.
 * @param offsets Developer's defined offsets
 * @param defaults The default offsets provided in the hook.
 * @returns 
 */
export function getOffset(
    offsets: { x?: number, y?: number, z?: number } | undefined,
    defaults: { x?: number, y?: number, z?: number },
): Vector3 {

    // If offsets isn't provided at all, just return defaults.
    if (!offsets) return new Vector3(defaults.x, defaults.y, defaults.z);

    return new Vector3(
        offsets.x || defaults.x,
        offsets.y || defaults.y,
        offsets.z || defaults.z,
    );
}