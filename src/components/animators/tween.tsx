import { Camera, Group, MathUtils, Mesh, Vector3 } from "three";
import { PositionedObject } from "../../types/common";


/**
 * Tween any 3D object to any position, even to a position of another object.
 */
class Tween {
    private chain: Promise<void>;
    private finished: boolean;

    constructor() {
        this.chain = Promise.resolve();
        this.finished = false;
    }


    /**
     * Tweens an object's position to another object's position.
     * @param source The object to animate
     * @param target The object to animate the `source` to.
     * @param duration The duration (in seconds) that the `source` will take to reach the `target`
     * @param vars An object containing tween options
     */
    tween(
        /**
         * The object to animate to the `target`
         */
        source: Mesh | Group | Camera,

        /**
         * The object to animate the `source` to.
         */
        target: PositionedObject,

        /**
         * The duration of the tween
         */
        duration: number,


        /**
         * Tween options.
         */
        vars?: {
            /**
             * How long should the tween wait before executing.
             */
            delay?: number,

            /**
             * Should the tweened object look at the target?
             * @default false
             */
            lookAtTarget?: boolean,

            /**
             * Called when the tween begins.
             */
            onBegin?: () => void,


            /**
             * Called when the tween ends.
             */
            onEnd?: () => void,


            /**
             * Called with the tween progresses.
             */
            onUpdate?: (progress: number, resolve: () => void) => void
        }
    ): Tween {
        this.chain = this.chain.then(() => {
            return new Promise<void>((resolve) => {
                if (target) {
                    const { delay = 0, lookAtTarget, onBegin, onUpdate, onEnd } = vars ?? {};
                    const startPosition = source.position.clone();
                    const targetPosition = target instanceof Vector3 ? target.clone() : target.position.clone();
                    const currentLookAt = source.getWorldDirection(new Vector3());
                    let tf = this.finished;

                    setTimeout(() => {
                        const startTime = performance.now();
                        if (onBegin) onBegin();
                        function animate() {
                            if (tf) return;
                            const elapsed = (performance.now() - startTime) / 1000;
                            const t = Math.min(elapsed / duration, 1);
                            if (onUpdate) onUpdate(t, () => (tf = true));

                            // Lerp from start to target; lerpVectors updates the source.position.
                            source.position.lerpVectors(startPosition, targetPosition, t);


                            if (lookAtTarget) {
                                const smoothed = currentLookAt.lerp(targetPosition, t);
                                source.lookAt(smoothed);
                            }

                            if (t < 1) {
                                requestAnimationFrame(animate);
                            } else {
                                if (onEnd) onEnd();
                                resolve();
                            }
                        }

                        animate();
                    }, delay * 1000);
                }
            });
        });
        return this;
    }

    finally(onFulfilled: () => void, onRejected?: (error: any) => void) {
        return this.chain.then(onFulfilled, onRejected);
    }
}


/**
 * Tweens an object's position to another object's position.
 * 
 * **Hey... You can chain this function!**
 * 
 * @param source The object to animate
 * @param target The object to animate the `source` to.
 * @param duration The duration (in seconds) that the `source` will take to reach the `target`
 * @param vars An object containing tween options
 */
export function tween(
    /**
     * The object to animate to the `target`
     */
    source: Mesh | Group | Camera,

    /**
     * The object to animate the `source` to.
     */
    target: PositionedObject,

    /**
     * The duration of the tween
     */
    duration: number,


    /**
     * Tween options.
     */
    vars?: {
        /**
         * How long should the tween wait before executing.
         */
        delay?: number,


        /**
         * Should the tweened object look at the target?
         * @default false
         */
        lookAtTarget?: boolean,

        /**
         * Called when the tween begins.
         */
        onBegin?: () => void,


        /**
         * Called when the tween ends.
         */
        onEnd?: () => void,


        /**
         * Called with the tween progresses.
         */
        onUpdate?: (progress: number, resolve: () => void) => void
    }
): Tween {
    const chain = new Tween();

    return chain.tween(
        source,
        target,
        duration,
        vars
    );
}
