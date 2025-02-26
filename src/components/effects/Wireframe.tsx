import { cloneElement, ForwardedRef, forwardRef, isValidElement, useEffect, useRef } from "react";
import { Group, Mesh } from "three";
import { ThreeObject } from "../../types/common";


/**
 * Applies wireframe effect on all of the children with no effort.
 */
export const Wireframe = forwardRef((
    {
        enabled = true,
        children
    }: { 
        /**
         * Enable wireframe on every child
         * @default true
         */
        enabled?: boolean,

        /**
         * Accepts only one children, if you want to apply the effect on more than one, wrap them in a `<group/>`
         */
        children: ThreeObject
    },
    ref: ForwardedRef<ThreeObject>
) => {

    const mesh = useRef<ThreeObject>(null);

    useEffect(() => {
        if (mesh.current) {
            if (mesh.current instanceof Mesh) {
                mesh.current.traverse((child) => {
                    if (child instanceof Mesh && child.material) {
                        // Check if the material is an array or a single material.
                        if (Array.isArray(child.material)) {
                            child.material.forEach((mat) => (mat.wireframe = enabled));
                        } else {
                            child.material.wireframe = enabled;
                        }
                    }
                });
            } else if (mesh.current instanceof Group) {
                mesh.current.traverse((child) => {
                    if (child instanceof Mesh && child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach((mat) => (mat.wireframe = enabled));
                        } else {
                            child.material.wireframe = enabled;
                        }
                    }
                });
            }
        }
    }, [enabled]);


    if (isValidElement(children)) {
        return cloneElement(children, ({
            ref: (node: ThreeObject) => {
                if (node) {
                    mesh.current = node;
                    if (ref) {
                        if (typeof ref === "function") {
                            ref(node);
                        } else {
                            ref.current = node;
                        }
                    }
                }
            }
        } as any));
    }

    return null;
});