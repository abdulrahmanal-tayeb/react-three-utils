import { ThreeObject } from "../common";

export type CollisionDetectorProps = CollisionDetectorBaseProps & CollisionDetectorCallbacks;

export interface CollisionDetectorBaseProps {
    /**
     * The first Mesh/Group that may collide with `second`
     */
    first: ThreeObject,

    /**
     * The second Mesh/Group that may collide with `first`
     */
    second: ThreeObject,

    /**
     * Whether the `onCollission` event should be called once per collision or as long as the object is colliding.
     */
    triggerOnce?: boolean,
}

export interface CollisionDetectorCallbacks {
    /**
     * Called when the objects are intersecting.
     */
    onCollission: (first: ThreeObject, second: ThreeObject) => void
}