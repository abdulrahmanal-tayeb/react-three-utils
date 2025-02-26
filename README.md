# React-Three-Utils (R3U)

**Craft immersive 3D web experiences without the boilerplate**  
A TypeScript library built on `react-three-fiber` and `drei` that simplifies 3D development. Designed for developers who prioritize clean, maintainable code.

[Live CodeSandbox Demo](https://codesandbox.io/p/sandbox/fz7p5s)

---

[![npm version](https://img.shields.io/npm/v/react-three-utils)](https://www.npmjs.com/package/react-three-utils)  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)  [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

## Why R3U?

Developing 3D interfaces shouldn't be unnecessarily complex. React-Three-Utils offers:

- **Well-designed components** for animations, effects, and environments
- **A straightforward API** that is easy to understand and use
- **TypeScript-first** implementation for type safety and reliability
- **Minimal yet effective abstractions** that enhance productivity

## Getting Started

### Installation
```bash
npm install react-three-utils @react-three/fiber @react-three/drei three
```

## Quick Demo Breakdown

This example creates a scene with floating cubes that:
- Slide into view while fading in
- Continuously rotate
- Emit red particles in arcs
- Shrink in the final 20% of their movement

```tsx
import "./styles.css";
import { Fade, Slide, Throw, StarField, Motion } from "react-three-utils";
import { useState, useMemo } from "react";
import { Mesh, SphereGeometry, MeshStandardMaterial } from "three";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function CosmicCube() {
  const [launchParticles, setLaunchParticles] = useState(false);

  // Preload particle geometry
  const redParticle = useMemo(() => {
    return new Mesh(
      new SphereGeometry(0.1),
      new MeshStandardMaterial({ color: "white" })
    );
  }, []);

  return (
    <Canvas>
      <StarField movements={{ y: 0.01 }} />
      <Slide enabled from={[0, 3, 3]} speed={0.3} animateScale>
        <Motion rotation={{ y: 0.01 }}>
          <Throw
            enabled={launchParticles}
            object={redParticle}
            interval={1000}
            travelDistance={5}
            velocity={(clock) => [0, 3, Math.cos(clock.getElapsedTime()) * 0.3]}
            onUpdate={(obj, progress) => {
              if (progress > 0.8) {
                obj.scale.setScalar(1 - (progress - 0.8) * 0.5);
              }
            }}
          >
            <Fade 
              enabled 
              type="in" 
              onComplete={() => setLaunchParticles(true)}
            >
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#2193c0" />
              </mesh>
            </Fade>
          </Throw>
        </Motion>
      </Slide>
      <ambientLight />
      <OrbitControls />
    </Canvas>
  );
}
```

## Full API Documentation

Coming soon.

## Contributing

If you encounter an issue or have a feature suggestion, consider contributing:

- Implement clear, maintainable TypeScript code
- Improve documentation for better clarity
- Write tests to ensure stability

### Contribution Process:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/new-feature`
3. Commit changes with meaningful messages
4. Push to the branch
5. Open a Pull Request

## License

MIT Licensed - Use freely while respecting ethical software practices.

Developed with ❤️ by [AmtCode](https://amtcode.com), with a focus on simplicity and efficiency. Powered by the react-three-fiber and drei ecosystems.