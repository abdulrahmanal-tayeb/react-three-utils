import { ForwardedRef, forwardRef, useMemo, useRef } from "react"
import { Group, Points } from "three"
import { StarsProps } from "../../types/environments/Stars";
import { toRGB } from "../../utils/colors";
import { useFrame } from "@react-three/fiber";


type Axis = "x" | "y" | "z";

/**
 * Stars enviroment (Or giant pointed sphere).
 */
export const StarField = forwardRef((
    {
        count = 1000,
        radius = 20,
        color = "#FFFFFF",
        starSize = 0.02,
        movements = {
            x: 0,
            y: 0,
            z: 0
        }
    }: StarsProps,
    ref: ForwardedRef<Group>
) => {
    const pointsRef = useRef<Group>(null);
    const [positions, colors, sizes] = useMemo(() => {
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const sizes = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            // Fibonacci sphere distribution for even but natural spread
            const phi = Math.acos(-1 + (2 * i) / count)
            const theta = Math.sqrt(count * Math.PI) * phi

            const x = radius * Math.cos(theta) * Math.sin(phi)
            const y = radius * Math.sin(theta) * Math.sin(phi)
            const z = radius * Math.cos(phi)

            // Add random displacement for natural look
            const displacement = radius * 0.05 * Math.random()
            positions[i * 3] = x + (Math.random() - 0.5) * displacement
            positions[i * 3 + 1] = y + (Math.random() - 0.5) * displacement
            positions[i * 3 + 2] = z + (Math.random() - 0.5) * displacement

            // Size variation with gamma distribution
            sizes[i] = Math.min(2, Math.max(0, starSize)) + Math.pow(Math.random(), 3) * 0.15

            // Color with random variations
            const rgbColor = toRGB(color);
            colors[i * 3] = rgbColor[0];
            colors[i * 3 + 1] = rgbColor[1];
            colors[i * 3 + 2] = rgbColor[2];
        }

        return [positions, colors, sizes]
    }, [count, radius]);

    useFrame(() => {
        if (pointsRef.current) {
            (["x", "y", "z"] as Axis[]).forEach((axis) => {
                const axisMovement = movements[axis];
                if (pointsRef.current && axisMovement) {
                    pointsRef.current.rotation[axis] += axisMovement;
                }
            });
        }
    });


    return (
        <group
            ref={(node) => {
                if (node) {
                    if (pointsRef) {
                        pointsRef.current = node;
                    }

                    if (ref) {
                        if (typeof ref === "function") {
                            ref(node);
                        } else {
                            ref.current = node;
                        }
                    }
                }
            }}
        >
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={count}
                        array={positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={count}
                        array={colors}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-size"
                        count={count}
                        array={sizes}
                        itemSize={1}
                    />
                </bufferGeometry>
                <shaderMaterial
                    uniforms={{
                        uTime: { value: 0 },
                    }}
                    vertexShader={`
                    attribute float size;
                    attribute vec3 color;
                    varying vec3 vColor;
                    
                    void main() {
                        vColor = color;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_PointSize = size * (300.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `}
                    fragmentShader={`
                    varying vec3 vColor;
                    
                    void main() {
                        vec2 coord = gl_PointCoord - vec2(0.5);
                        float dist = length(coord);
                        float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
                        alpha *= 1.0 - smoothstep(0.3, 0.4, dist) * 0.5; // Soft glow
                        gl_FragColor = vec4(vColor, alpha);
                    }
                `}
                    transparent={true}
                    depthWrite={false}
                />
            </points>
        </group>
    );
});