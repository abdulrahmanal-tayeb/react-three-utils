import { CSSProperties, ReactElement, ReactNode } from "react";


export interface OverlaysProps {
    /**
     * Wrapper styles :)
     */
    style?: CSSProperties,


    /**
     * Class name... surprising huh?
     */
    className?: string,


    /**
     * The ID... Did you expect that?
     */
    id?: string,
    children: ReactNode | Array<ReactNode>
}


export interface OverlayProps {
    /**
     * A react node to keep a reference of and to join it with other overlays
     */
    children: ReactElement | ReactNode,


    /**
     * Its unique name. This will be used when retreiving it from the overlays object.
     */
    id: string
}