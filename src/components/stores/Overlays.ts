import { ReactElement, ReactNode, RefObject } from "react";
import { create } from "zustand";


/**
 * A Centralized store to keep a reference of all elements whose animation
 * needs to be synced with each other using external animation libraries (e.g. GSAP)
 */
export const useOverlays = create<{
    /**
    * Contains all of the references of the nodes wrapped with `<Overlay/>`
    */
    overlays: Record<string, ReactElement | ReactNode | null>,

    /**
     * Updates the store and adds a new reference to a new node.
     */
    updateOverlays: (
        /**
         * Unique name for the overlay to retreive it by from the overlays object.
         */
        id: string,


        /**
         * The container reference.
         */
        ref: RefObject<ReactElement | ReactNode>
    ) => void
}>((set) => ({
    overlays: {},
    updateOverlays: (
        id: string,
        ref: RefObject<ReactElement | ReactNode>
    ) => (set((state) => {
        if(id in state.overlays){
            throw new Error(`Container ID (${id}) already exist on another overlay.\n\nHint: You are setting the same ID on more than one <Overlay/>`)
        }
        return {
            overlays: {...state.overlays, [id]: ref.current}
        }
    }))
}));