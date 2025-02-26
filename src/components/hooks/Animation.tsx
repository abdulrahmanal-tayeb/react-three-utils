import { useFBX } from "@react-three/drei";

/**
 * Extracts the animations from an `FBX` file and renames them.
 * @param path The path to the `.fbx` animation
 * @param name The name of the animation
 * @returns 
 */
export function useFBXAnimations(path: string, name: string) {
    const { animations } = useFBX(path);
    if (name) {
        animations.forEach((animation, i) => (
            animation.name = `${name}${i > 0 ? `_${i}` : ''}`
        ))
    }
    return animations
}