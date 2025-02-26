import { ReactElement } from "react";
import { Texture } from "three";


/**
 * Returns a random texture of a given array of textures.
 * @param arr An array of textures
 */
export function getRandomTexture(arr: Array<Texture | null>) {
    if (!Array.isArray(arr) || arr.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}


/**
 * Returns a random object from a given array of objects.
 * @param arr Array of objects
 */
export function getRandomObject(arr: Array<ReactElement>) {
    if (!Array.isArray(arr) || arr.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}


/**
 * Returns a random number between `min` and `max`.
 */
export function getRandomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
}




// Helper function for HSL to RGB conversion
export function hslToRgb(h: number, s: number, l: number): Array<number> {
    let r, g, b
    if (s === 0) {
        r = g = b = l
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1 / 3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1 / 3)
    }

    return [r, g, b]
}


/**
 * Checks if the user's device is touch screen or not.
 */
export function isTouchDevice(): boolean {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }

    // Check for standard touch events
    const hasTouchEvents = 'ontouchstart' in window;

    // Check for touch points (modern browsers and IE10+)
    const hasTouchPoints =
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
        ((navigator as any).msMaxTouchPoints && (navigator as any).msMaxTouchPoints > 0);

    // Fallback using matchMedia for devices with coarse pointers (i.e. touch screens)
    const hasCoarsePointer =
        window.matchMedia && window.matchMedia('(pointer: coarse)')?.matches;

    return hasTouchEvents || hasTouchPoints || hasCoarsePointer;
}