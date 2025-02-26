import { LineProps as DreiLineProps } from "@react-three/drei"
import { ReactNode } from "react"
import { ExtrudeGeometryOptions, Vector3 } from "three"

export interface LineProps {
    /**
     * The points for the curve to be drawn through.
     */
    points: Array<Vector3>,


    /**
     * The line mesh children, incase you are using extrusion.
     */
    children?: ReactNode,


    /**
     * If true, the line will be connected from both ends (the end point will connect to the start point.)
     */
    closed?: boolean,


    /**
     * Extrude the line
     */
    extrude?: {
        /**
         * Extrusion amount on the X axis
         */
        x?: number,


        /**
         * Extrusion amount on the Y axis
         */
        y?: number,


        /**
         * Start of extrusion on the X axis.
         */
        startX?: number,


        /**
         * Start of extrusion on the Y axis.
         */
        startY?: number,


        /**
         * Line extrusion steps.
         */
        steps?: number,


        /**
         * Any additional props you would like to pass to the underlying `extrudeGeometry`.
         */
        props?: ExtrudeGeometryOptions
    },

    /**
     * Any additional props you would like to pass to the underlying `Line`.
     */
    lineProps?: Omit<DreiLineProps, "points">,


    /**
     * Center the line no matter the amount of extrusion.
     */
    center?: boolean
}