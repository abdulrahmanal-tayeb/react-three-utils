import { PerspectiveCamera, useFBO } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { ForwardedRef, forwardRef, isValidElement, ReactNode, RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Camera, Mesh, PerspectiveCamera as AbstractPerspectiveCamera, BufferGeometry, MeshBasicMaterial, Group } from "three";
import { ScreenProps } from "../../types/effects/Screen";
import { Vector3 } from "three";


/**
 * Simulates a screen that mirrors a camera view.
 */
export const Screen = forwardRef(({
    src,
    update = true,
    turnedOff,
    style,
    children
}: ScreenProps,
    ref: ForwardedRef<Mesh>
) => {

    const fbo = useFBO(1024, 1024);
    const { gl, scene } = useThree();
    const meshRef = useRef<Mesh>(null);

    useFrame(() => {
        if (src && update) {
            // Hide the mirror plane so it doesn't show in its own reflection
            if (meshRef.current) meshRef.current.visible = false;
            // Render the scene from the provided camera into the FBO
            gl.setRenderTarget(fbo);
            gl.render(scene, src);
            gl.setRenderTarget(null);
            // Restore visibility
            if (meshRef.current) meshRef.current.visible = true;
        }
    });

    const appliedMaterial = useMemo(() => {
        if (turnedOff) {
            if (style && !!style.off) {
                return style.off;
            }

            return { color: "black" }
        }

        return {
            map: fbo.texture,
            ...((style && !!style.on) ? style.on : {})
        }
    }, [turnedOff]);


    return (
        <mesh
            ref={(node) => {
                meshRef.current = node;
                if (ref) {
                    if (typeof ref === "function") {
                        ref(node);
                    } else {
                        ref.current = node;
                    }
                }
            }}
        >
            {/* Define the plane geometry. You can adjust the size via args if needed */}
            {isValidElement(children) && children}

            {/* Apply the FBO texture to the material */}
            <meshBasicMaterial {...appliedMaterial} />
        </mesh>
    );
})



/**
 * Mirrors whatever infront of it.
 */
export const Mirror = forwardRef((
    {
        children
    }: { children: ReactNode },
    ref: ForwardedRef<Group>
) =>  {
    const [ready, setReady] = useState(false);
    const cam = useRef<AbstractPerspectiveCamera>(null);
    const screen = useRef<Mesh>(null);

    useEffect(() => {
        if (cam.current) {
            setReady(true);
        }
    }, []);

    useFrame(() => {
        if (ready && cam.current && screen.current) {
            
            // Assume the screen’s local forward direction is +Z.
            // Get its world direction.
            const screenForward = new Vector3();
            screen.current.getWorldDirection(screenForward);
            // Compute a target position for the camera based on its current position.
            const target = cam.current.position.clone().add(screenForward);
            cam.current.lookAt(target);
            cam.current.rotation.z = Math.PI;
        }
    });

    return (
        <group ref={ref}>
            {cam.current && (
                <Screen
                    ref={screen}
                    src={cam.current}
                >
                    {isValidElement(children) && children}
                </Screen>
            )}
            <PerspectiveCamera ref={cam} />
        </group>
    );
})