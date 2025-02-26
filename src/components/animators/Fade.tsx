import { useFrame } from "@react-three/fiber";
import {
  isValidElement,
  cloneElement,
  useLayoutEffect,
  useRef,
} from "react";
import { Mesh, MathUtils } from "three";
import { FadeProps } from "../../types/animators/Fade";


/**
 * Fades a mesh in or out.
 */
export function Fade({
  children,
  type,
  speed = 1,
  enabled,
  delay,
  onComplete,
}: FadeProps) {

  /**
   * Stores the state as to whether the object's opacity reached the target.
   */
  const reachedTarget = useRef(!!delay);


  /**
   * The objects reference.
   */
  const meshRef = useRef<Mesh>(null);


  useLayoutEffect(() => {
    if(delay){
        setTimeout(() => {
            reachedTarget.current = false;
        }, delay * 1000)
    } else {
        reachedTarget.current = false;
    }

    if (
      meshRef.current && 
      meshRef.current.material && 
      !Array.isArray(meshRef.current.material)
    ) {
      meshRef.current.material.transparent = true;
      meshRef.current.material.opacity = type === "in" ? 0 : 1;
    }
  }, [type]);


  useFrame((state, delta) => {
    if (!enabled || reachedTarget.current || !meshRef.current) return;
    const material = meshRef.current.material;
    if (!material || Array.isArray(material)) return;

    if (type === "out") {
      if (Math.abs(material.opacity - 0) < 0.1) {
        reachedTarget.current = true;
        material.opacity = 0;
        return onComplete && onComplete(meshRef.current);
      }
      material.opacity = MathUtils.lerp(material.opacity, 0, delta * speed);

    } else if (type === "in") {
      if (Math.abs(material.opacity - 1) < 0.1) {
        reachedTarget.current = true;
        material.opacity = 1;
        return onComplete && onComplete(meshRef.current);
      }
      material.opacity = MathUtils.lerp(material.opacity, 1, delta * speed);

    }
  });

  return isValidElement(children) ? cloneElement(children, { ref: meshRef } as any) : null;
}