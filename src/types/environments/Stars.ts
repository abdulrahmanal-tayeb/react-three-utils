export interface StarsProps {
    /**
     * Stars count.
     * @default 1000
     */
    count?: number,


    /**
     * How wide the stars sphere is.
     * @default 20
     */
    radius?: number,


    /**
     * Color in either Hex, Hsl, or RGB strings.
     * @default #FFFFFF
     */
    color?: string,



    /**
     * Star size in world units.
     * @default 0.02
     */
    starSize?: number,



    /**
     * How fast should the sphere orbit itself.
     * @default 0 - Doesn't move.
     */
    movements?: {
        [key: string]: any;
        
        /**
         * How fast should the sphere rotate on the x Axis.
         */
        x?: number;

        
        /**
         * How fast should the sphere rotate on the y Axis.
         */
        y?: number;


        /**
         * How fast should the sphere rotate on the z Axis.
         */
        z?: number;
    },
}