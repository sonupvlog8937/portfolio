import * as THREE from "three";

interface Floater {
  mesh: THREE.Mesh;
  base: THREE.Vector3;
  speed: number;
  amp: number;
  spin: number;
}

function emissiveMaterial(
  color: string,
  emissiveIntensity: number,
  metalness = 0.55,
  roughness = 0.28
) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity,
    metalness,
    roughness,
  });
}

export function createFloatingObjects(mobile: boolean) {
  const group = new THREE.Group();
  group.position.set(mobile ? 0 : 1.9, mobile ? 0.8 : 0, mobile ? -1.5 : -0.6);
  group.scale.setScalar(mobile ? 0.62 : 1);

  // Central prism - orange themed
  const prism = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.15, 16),
    emissiveMaterial("#ea580c", 0.3, 0.7, 0.18)
  );
  const prismWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.45, 1),
    new THREE.MeshBasicMaterial({
      color: "#F97316",
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    })
  );
  prism.add(prismWire);
  group.add(prism);

  const shapes: Floater[] = [];
  const addShape = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    position: [number, number, number],
    speed: number,
    amp: number,
    spin: number
  ) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    group.add(mesh);
    shapes.push({ mesh, base: mesh.position.clone(), speed, amp, spin });
  };

  // Orange/Yellow themed shapes
  addShape(
    new THREE.TorusGeometry(0.5, 0.16, 24, 64),
    emissiveMaterial("#F97316", 0.5),
    [-2.3, 1.4, -1],
    1.6,
    0.35,
    0.5
  );
  addShape(
    new THREE.OctahedronGeometry(0.45),
    emissiveMaterial("#FBBF24", 0.5),
    [-1.9, -1.5, 0.4],
    1.2,
    0.3,
    0.6
  );
  addShape(
    new THREE.TetrahedronGeometry(0.42),
    emissiveMaterial("#EC4899", 0.45),
    [2.5, -1.3, -0.9],
    1.9,
    0.28,
    0.7
  );
  addShape(
    new THREE.SphereGeometry(0.3, 32, 32),
    emissiveMaterial("#FBBF24", 0.5, 0.4, 0.2),
    [2.2, 1.6, -1.4],
    1.4,
    0.25,
    0.4
  );
  // Additional colorful shapes
  addShape(
    new THREE.TorusKnotGeometry(0.3, 0.1, 64, 8),
    emissiveMaterial("#8B5CF6", 0.4),
    [-1.2, 2.1, -2],
    1.3,
    0.32,
    0.55
  );
  addShape(
    new THREE.DodecahedronGeometry(0.35),
    emissiveMaterial("#10B981", 0.45),
    [1.8, -2.0, 0.8],
    1.5,
    0.27,
    0.65
  );
  addShape(
    new THREE.ConeGeometry(0.25, 0.5, 32),
    emissiveMaterial("#00F2FF", 0.4),
    [-2.8, -0.8, 0.2],
    1.7,
    0.3,
    0.5
  );

  return {
    group,
    update(t: number, dt: number) {
      prism.rotation.y += dt * 0.3;
      prism.rotation.x += dt * 0.1;
      prism.scale.setScalar(1 + Math.sin(t * 0.8) * 0.04);
      shapes.forEach((floater, i) => {
        floater.mesh.position.y =
          floater.base.y + Math.sin(t * floater.speed + i * 1.7) * floater.amp;
        floater.mesh.position.x =
          floater.base.x + Math.cos(t * floater.speed * 0.7 + i * 1.3) * floater.amp * 0.5;
        floater.mesh.rotation.x += dt * floater.spin;
        floater.mesh.rotation.y += dt * floater.spin * 0.7;
        floater.mesh.rotation.z += dt * floater.spin * 0.3;
      });
    },
  };
}