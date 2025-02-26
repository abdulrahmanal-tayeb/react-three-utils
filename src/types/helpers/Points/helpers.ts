import { CubicBezierCurve3, Vector3 } from "three";
import { ArcConfig, BezierConfig, CubeConfig, CylinderConfig, EllipseConfig, HelixConfig, LinearConfig, LissajousConfig, ParametricConfig, PolygonConfig, PolylineConfig, RectangleConfig, RoseConfig, SineConfig, SpiralConfig, StarConfig, SuperformulaConfig, TorusConfig, Vector3Like } from "./curve-types";
import { registerCurveType } from "components/helpers";

export function toVector3(v: Vector3Like): Vector3 {
  return Array.isArray(v) ? new Vector3(...v) : v.clone();
}

export function validateSegments(segments: number) {
  if (!Number.isInteger(segments)) throw new Error("Segments must be an integer");
  if (segments <= 0) throw new Error("Segments must be > 0");
}

export function randomVector(): Vector3 {
  return new Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5
  ).multiplyScalar(2); // Returns vectors in range [-1, 1] for all components
}

// Optional alternative with normalized output
export function randomDirection(): Vector3 {
  return randomVector().normalize();
}


/**
 * This function registers all default, pre-defined and ready to use, curves.
 */
export function registerDefaultCurves() {
  // 1. Linear Curve
  registerCurveType<LinearConfig>("linear", (config) => {
    const { start = [0, 0, 0], end = [0, 0, -10], segments = 10, noise = 0 } = config;
    validateSegments(segments);
    const s = toVector3(start);
    const e = toVector3(end);

    return Array.from({ length: segments + 1 }).map((_, i) => {
      const t = i / segments;
      return new Vector3()
        .lerpVectors(s, e, t)
        .addScaledVector(randomVector(), noise * t * (1 - t));
    });
  });

  // 2. Sine Wave
  registerCurveType<SineConfig>("sine", (config) => {
    const { axis = "x", amplitude = 2, frequency = 2, length = 20, segments = 30, phase = 0 } = config;
    validateSegments(segments);
    const axisIdx = { x: 0, y: 1, z: 2 }[axis];
    const forwardIdx = axis === "z" ? 2 : 1;

    return Array.from({ length: segments }).map((_, i) => {
      const vec = new Vector3();
      vec.setComponent(
        axisIdx,
        Math.sin((i / segments) * Math.PI * frequency + phase) * amplitude
      );
      vec.setComponent(forwardIdx, -i * (length / segments));
      return vec;
    });
  });

  // 3. 3D Spiral
  registerCurveType<SpiralConfig>("spiral", (config) => {
    const { axis = "y", radius = 3, height = 10, turns = 3, segments = 50, clockwise = true } = config;
    validateSegments(segments);
    const dir = clockwise ? 1 : -1;
    const [hAxis, cAxis1, cAxis2] =
      axis === "x" ? ["x", "y", "z"] :
        axis === "y" ? ["y", "x", "z"] : ["z", "x", "y"];

    return Array.from({ length: segments }).map((_, i) => {
      const angle = dir * (i / segments) * Math.PI * 2 * turns;
      const vec = new Vector3();
      // Assign components using bracket notation.
      (vec as any)[hAxis] = (i / segments) * height - height / 2;
      (vec as any)[cAxis1] = Math.cos(angle) * radius;
      (vec as any)[cAxis2] = Math.sin(angle) * radius;
      return vec;
    });
  });

  // 4. Superformula
  registerCurveType<SuperformulaConfig>("superformula", (config) => {
    const { m = 3, n1 = 1, n2 = 1, n3 = 1, scale = 1, segments = 100 } = config;
    validateSegments(segments);
    return Array.from({ length: segments }).map((_, i) => {
      const phi = (i / segments) * Math.PI * 2;
      const r = Math.pow(
        Math.pow(Math.abs(Math.cos(m * phi / 4) / scale), n2) +
        Math.pow(Math.abs(Math.sin(m * phi / 4) / scale), n3),
        -1 / n1
      );
      return new Vector3(r * Math.cos(phi), r * Math.sin(phi), 0);
    });
  });

  // 5. Arc
  registerCurveType<ArcConfig>("arc", (config) => {
    const { center = [0, 0, 0], radius = 5, startAngle = 0,
      endAngle = Math.PI * 2, segments = 32, plane = "xy" } = config;
    validateSegments(segments);
    const [xIdx, yIdx] = plane === "xy" ? [0, 1] :
      plane === "xz" ? [0, 2] : [1, 2];
    const [x, y, z] = Array.isArray(center) ? center : [center.x, center.y, center.z];

    return Array.from({ length: segments }).map((_, i) => {
      const angle = startAngle + (i / segments) * (endAngle - startAngle);
      const vec = new Vector3();
      (vec as any)[xIdx] = x + Math.cos(angle) * radius;
      (vec as any)[yIdx] = y + Math.sin(angle) * radius;
      return vec;
    });
  });

  // 6. Bezier
  // This is not very useful.
  // registerCurveType<BezierConfig>("bezier", (config) => {
  //   const { points = [[0, 0, 0], [5, 5, 0], [10, 0, 0], [15, 5, 0]], segments = 50 } = config;
  //   validateSegments(segments);
  //   const curve = new CubicBezierCurve3(
  //     points.map(p => toVector3(p))
  //   );
  //   return curve.getPoints(segments);
  // });

  // 7. Ellipse
  registerCurveType<EllipseConfig>("ellipse", (config) => {
    const { center = [0, 0, 0], xRadius = 5, yRadius = 3,
      rotation = 0, segments = 40, plane = "xy" } = config;
    validateSegments(segments);
    const [xIdx, yIdx] = plane === "xy" ? [0, 1] :
      plane === "xz" ? [0, 2] : [1, 2];
    const [x, y, z] = Array.isArray(center) ? center : [center.x, center.y, center.z];

    return Array.from({ length: segments }).map((_, i) => {
      const angle = (i / segments) * Math.PI * 2;
      const vec = new Vector3();
      (vec as any)[xIdx] = x + Math.cos(angle + rotation) * xRadius;
      (vec as any)[yIdx] = y + Math.sin(angle + rotation) * yRadius;
      return vec;
    });
  });

  // 8. Polygon
  registerCurveType<PolygonConfig>("polygon", (config) => {
    const { sides = 5, radius = 5, center = [0, 0, 0], rotation = 0, plane = "xy" } = config;
    validateSegments(sides);
    const [xIdx, yIdx] = plane === "xy" ? [0, 1] :
      plane === "xz" ? [0, 2] : [1, 2];
    const [x, y, z] = Array.isArray(center) ? center : [center.x, center.y, center.z];

    return Array.from({ length: sides }).map((_, i) => {
      const angle = (i / sides) * Math.PI * 2 + rotation;
      const vec = new Vector3();
      (vec as any)[xIdx] = x + Math.cos(angle) * radius;
      (vec as any)[yIdx] = y + Math.sin(angle) * radius;
      return vec;
    });
  });

  // 9. Star
  registerCurveType<StarConfig>("star", (config) => {
    const { points = 5, innerRadius = 3, outerRadius = 5,
      center = [0, 0, 0], rotation = 0, plane = "xy" } = config;
    const [xIdx, yIdx] = plane === "xy" ? [0, 1] :
      plane === "xz" ? [0, 2] : [1, 2];
    const [x, y, z] = Array.isArray(center) ? center : [center.x, center.y, center.z];

    return Array.from({ length: points * 2 }).map((_, i) => {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i / (points * 2)) * Math.PI * 2 + rotation;
      const vec = new Vector3();

      (vec as any)[xIdx] = x + Math.cos(angle) * radius;
      (vec as any)[yIdx] = y + Math.sin(angle) * radius;
      return vec;
    });
  });

  // 10. Helix
  registerCurveType<HelixConfig>("helix", (config) => {
    const { radius = 2, height = 10, turns = 5, segments = 50, clockwise = true } = config;
    validateSegments(segments);
    const direction = clockwise ? 1 : -1;

    return Array.from({ length: segments }).map((_, i) => {
      const progress = i / segments;
      return new Vector3(
        Math.cos(direction * progress * Math.PI * 2 * turns) * radius,
        progress * height - height / 2,
        Math.sin(direction * progress * Math.PI * 2 * turns) * radius
      );
    });
  });

  // 11. Parametric
  registerCurveType<ParametricConfig>("parametric", (config) => {
    const { fn = (t) => [t, t, t], range = [0, 1], segments = 50 } = config;
    validateSegments(segments);

    return Array.from({ length: segments }).map((_, i) => {
      const t = range[0] + (i / segments) * (range[1] - range[0]);
      return toVector3(fn(t));
    });
  });

  // 12. Lissajous
  registerCurveType<LissajousConfig>("lissajous", (config) => {
    const { a = 3, b = 2, delta = Math.PI / 2, size = 10, segments = 100 } = config;
    validateSegments(segments);

    return Array.from({ length: segments }).map((_, i) => {
      const t = (i / segments) * Math.PI * 2;
      return new Vector3(
        size * Math.sin(a * t + delta),
        size * Math.sin(b * t),
        0
      );
    });
  });

  // 13. Polyline
  registerCurveType<PolylineConfig>("polyline", (config) => {
    return (config.points || []).map(p => toVector3(p));
  });

  // 14. Rectangle
  registerCurveType<RectangleConfig>("rectangle", (config) => {
    const { width = 10, height = 5, center = [0, 0, 0] } = config;
    const halfW = width / 2;
    const halfH = height / 2;

    const [x, y, z] = Array.isArray(center) ? center : [center.x, center.y, center.z];
    return [
      [x - halfW, y - halfH, z],
      [x + halfW, y - halfH, z],
      [x + halfW, y + halfH, z],
      [x - halfW, y + halfH, z],
      [x - halfW, y - halfH, z]
    ].map(p => toVector3(p as [number, number, number]));
  });

  // 15. Cube
  registerCurveType<CubeConfig>("cube", (config) => {
    const { size = 5, center = [0, 0, 0] } = config;
    const half = size / 2;
    const [x, y, z] = Array.isArray(center) ? center : [center.x, center.y, center.z];

    return [
      // Front face
      [x - half, y - half, z + half],
      [x + half, y - half, z + half],
      [x + half, y + half, z + half],
      [x - half, y + half, z + half],
      [x - half, y - half, z + half],

      // Back face
      [x - half, y - half, z - half],
      [x + half, y - half, z - half],
      [x + half, y + half, z - half],
      [x - half, y + half, z - half],
      [x - half, y - half, z - half],

      // Connections
      [x + half, y - half, z - half],
      [x + half, y + half, z - half],
      [x - half, y + half, z - half],
      [x - half, y - half, z - half]
    ].map(p => toVector3(p as [number, number, number]));
  });

  // 16. Cylinder
  registerCurveType<CylinderConfig>("cylinder", (config) => {
    const { radius = 3, height = 10, segments = 32 } = config;
    validateSegments(segments);
    const points: Vector3[] = [];

    // Bottom circle
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new Vector3(
        Math.cos(angle) * radius,
        -height / 2,
        Math.sin(angle) * radius
      ));
    }

    // Top circle
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new Vector3(
        Math.cos(angle) * radius,
        height / 2,
        Math.sin(angle) * radius
      ));
    }

    // Connect circles
    points.push(points[0], points[segments]);
    return points;
  });

  // 17. Torus
  registerCurveType<TorusConfig>("torus", (config) => {
    const { majorRadius = 5, minorRadius = 2,
      majorSegments = 32, minorSegments = 16 } = config;
    validateSegments(majorSegments);
    validateSegments(minorSegments);
    const points: Vector3[] = [];

    for (let i = 0; i < majorSegments; i++) {
      const majorAngle = (i / majorSegments) * Math.PI * 2;
      const centerX = Math.cos(majorAngle) * majorRadius;
      const centerZ = Math.sin(majorAngle) * majorRadius;

      for (let j = 0; j < minorSegments; j++) {
        const minorAngle = (j / minorSegments) * Math.PI * 2;
        points.push(new Vector3(
          centerX + Math.cos(majorAngle) * Math.cos(minorAngle) * minorRadius,
          Math.sin(minorAngle) * minorRadius,
          centerZ + Math.sin(majorAngle) * Math.cos(minorAngle) * minorRadius
        ));
      }
    }
    return points;
  });

  // 18. Rose
  registerCurveType<RoseConfig>("rose", (config) => {
    const { petals = 4, length = 5, segments = 100 } = config;
    validateSegments(segments);

    return Array.from({ length: segments }).map((_, i) => {
      const theta = (i / segments) * Math.PI * 2;
      const radius = length * Math.cos(petals * theta);
      return new Vector3(
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        0
      );
    });
  });
}
