import { LineProps as DreiLineProps } from "@react-three/drei";
import { RefObject } from "react";
import { Camera, Vector3 } from "three";
import { Group } from "three";
import { Mesh } from "three";

export interface ObjectPathProps {
    /**
     * The object that will follow the path.
     */
    object: RefObject<Mesh | Group | Camera | null>;


    /**
     * Should the object follow the quaternion of the curve?
     */
    followQuaternion?: boolean;


    /**
     * Show the path the object will follow temporarily.
     */
    debug?: boolean;


    /**
     * The points that defines the path, which is an `Array` containing `Vector3`.
     */
    points?: Array<Vector3>;


    /**
     * Additional props for customization of a line.
     */
    lineProps?: Omit<DreiLineProps, "points">;


    /**
     * Props to pass to the underlying `CatmullRomCurve3`.
     */
    curveProps?: {
        /**
         * Should the curve be closed from both ends?
         */
        closed?: boolean,

        
        /**
         * Curve type :)
         */
        curveType?: "catmullrom" | "centripetal" | "chordal",


        /**
         * Curve tension ;)
         */
        tension?: number
    };

    /**
     * Animation progress where 0 is the start of the animation, 1 is the end of it.
     * 
     * The default behaviour is to use the scroll progress of the `ScrollControls`.
     */
    progress?: number
}

