import { useFrame } from "@react-three/fiber";
import { useRef, useCallback, isValidElement, cloneElement, RefObject } from "react";
import { Clock, Group, Mesh, Vector3 } from "three";
import { ThrowProps } from "../../types/effects/Throw";


/**
 * Throws particles from an object.
 */
export function Throw({
    children,
    velocity,
    travelDistance,
    interval,
    object,
    source,
    enabled,

    onUpdate,
    onSpawn,
    onDispose
}: ThrowProps) {
    // Reference to the source (the "antenna")
    const sourceRef = useRef<Group>(null);

    const spawnPos = useRef<Vector3>(new Vector3());

    // Group that will hold all the thrown objects
    const thrownGroupRef = useRef(new Group());
    // List to track each thrown item and its metadata, including its initial velocity.
    const activeThrows = useRef<
        Array<{
            mesh: Mesh | Group;
            spawnPos: Vector3;
            spawnTime: number;
            initialVelocity: Vector3;
        }>
    >([]);

    // Timer to control spawning (in milliseconds)
    const spawnAccumulator = useRef(0);
    // For a one‑time spawn when no interval is provided
    const hasSpawnedOnce = useRef(false);

    // Spawn a clone at the source’s current world position,
    // capturing its initial velocity from the current clock.
    const spawn = useCallback(
        (currentTime: number, clock: Clock) => {
            if (!object || !enabled) return;

            // Get the current world position of the source.

            if (source) {
                source.getWorldPosition(spawnPos.current);
            }
            else if (sourceRef.current) {
                // console.log("SPAWN: ", spawnPos.current);
                sourceRef.current.getWorldPosition(spawnPos.current);
            }
            // console.log("SPAWNED: ", spawnPos.current);

            const clone = object.clone();
            // Start hidden (scale 0) so it can fade in.
            clone.scale.set(0, 0, 0);
            // Set the position to the spawn point.
            clone.position.copy(spawnPos.current);

            // Compute the initial velocity for this thrown object.
            const initialVel = new Vector3();
            if (typeof velocity === "function") {
                initialVel.fromArray(velocity(clock));
            } else {
                initialVel.set(velocity?.x ?? 0, velocity?.y ?? 0, velocity?.z ?? 0);
            }

            activeThrows.current.push({
                mesh: clone,
                spawnPos: spawnPos.current.clone(),
                spawnTime: currentTime,
                initialVelocity: initialVel.clone(),
            });
            if (onSpawn) {
                onSpawn();
            }
            thrownGroupRef.current.add(clone);
        },
        [object, velocity]
    );

    useFrame((state, delta) => {
        const currentTime = state.clock.getElapsedTime();

        // Spawn a new clone based on the interval or spawn once if no interval is provided.
        if (interval) {
            spawnAccumulator.current += delta * 1000; // delta in ms
            if (spawnAccumulator.current >= interval) {
                spawn(currentTime, state.clock);
                spawnAccumulator.current -= interval;
            }
        } else if (!hasSpawnedOnce.current) {
            spawn(currentTime, state.clock);
            hasSpawnedOnce.current = true;
        }

        // Update each thrown object.
        for (let i = activeThrows.current.length - 1; i >= 0; i--) {
            const item = activeThrows.current[i];
            const { mesh, spawnPos, spawnTime, initialVelocity } = item;

            // Move the object using its own stored initial velocity.
            mesh.position.addScaledVector(initialVelocity, delta);

            // Determine how far it has traveled.
            const distance = mesh.position.distanceTo(spawnPos);

            // Fade in: scale up from 0 to 1 over fadeDuration seconds.
            const fadeDuration = 0.1;
            const elapsed = currentTime - spawnTime;
            if (elapsed < fadeDuration) {
                const scale = elapsed / fadeDuration;
                mesh.scale.set(scale, scale, scale);
            } else {
                mesh.scale.set(1, 1, 1);
            }

            // Compute progress as the ratio of distance traveled to travelDistance.
            const progress = travelDistance ? Math.min(distance / travelDistance, 1) : 0;
            // Call the onUpdate callback (if provided) with the current mesh and progress.
            if (onUpdate) {
                onUpdate(mesh, progress);
            }

            // If the object has traveled beyond travelDistance, remove it.
            if (travelDistance && distance >= travelDistance) {
                thrownGroupRef.current.remove(mesh);
                activeThrows.current.splice(i, 1);
                if (onDispose) {
                    onDispose();
                }
            }
        }
    });


    return (
        <group>
            {/* The moving source – attach a ref to always get its current world position */}
            {(!(!!source) && isValidElement(children)) && cloneElement(children, { ref: sourceRef } as {ref: RefObject<Group>})}

            {/* Render the group that holds all the thrown objects */}
            <primitive object={thrownGroupRef.current} />
        </group>
    );
}