import * as THREE from "three";

export function createParticleField(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const colorPalette = [
    new THREE.Color("#F97316"), // Orange
    new THREE.Color("#FBBF24"), // Yellow
    new THREE.Color("#EC4899"), // Pink
    new THREE.Color("#8B5CF6"), // Purple
    new THREE.Color("#00F2FF"), // Cyan
  ];

  for (let i = 0; i < count; i++) {
    const radius = 6 + Math.random() * 7;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
    positions[i * 3 + 2] = -Math.abs(radius * Math.cos(phi));

    // Assign random color from palette
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 0.025,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);

  return {
    points,
    update(dt: number) {
      points.rotation.y += dt * 0.03;
      points.rotation.x += dt * 0.01;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}