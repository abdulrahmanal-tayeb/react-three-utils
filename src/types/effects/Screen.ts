import { ReactNode } from "react";
import { MeshBasicMaterialParameters, PerspectiveCamera, Camera } from "three";

export interface ScreenProps {
    /**
     * The source the screen will mirror (Camera)
     */
    src: Camera | PerspectiveCamera,


    /**
     * Whether the screen itself be visible inside itself. How? The screen might also be
     * visible within the viewport of the camera being mirrored!
     * 
     * @default false
     */
    includeSelf?: boolean,


    /**
     * Whether the screen should update or not. if not, the screen will freeze.
     * @default true
     */
    update?: boolean,


    /**
     * Turn the screen off (black), or on (mirroring the camera view).
     * @default false
     */
    turnedOff?: boolean,


    /**
     * The geometry that will mirror the camera and it could be any Three.js supported geometry.
     * 
     * Note: This best works with plane geometries. Yet, you can fiddle with it a bit... why not!?
     * 
     */
    children: ReactNode,


    /**
     * The screen materials styles. This will directly be passed to the underlying `meshBasicMaterial`, so it
     * supports everything three.js supports.
     */
    style?: {

        /**
         * The styles applied to the material when the screen is off.
         */
        off?: MeshBasicMaterialParameters,


        /**
         * The styles applied to the material when the screen is on.
         */
        on?: MeshBasicMaterialParameters,
    },
}