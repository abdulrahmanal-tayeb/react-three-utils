import { Mesh } from "three";
import { BaseAnimationProps } from "./base";
import { ReactNode } from "react";

export interface FadeProps extends BaseAnimationProps {
    /**
     * The mesh to be faded.
     */
    children: Mesh | ReactNode,


    /**
     * The type of the fade.
     * 
     * - `in`: Fades the mesh in (from 0 to 1)
     * - `out`: Fades the mesh out (from 1 to 0)
     */
    type: "in" | "out";
}