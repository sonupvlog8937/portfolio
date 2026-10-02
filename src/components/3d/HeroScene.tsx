import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createFloatingObjects } from "./FloatingObjects";
import { createParticleField } from "./ParticleField";

export default function HeroScene({ reduced }: { reduced: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cleanup: () => void = () => {};

    try {
      const mobile = window.innerWidth < 768;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 0, 7.5);

      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
      keyLight.position.set(3, 4, 5);
      scene.add(keyLight);
      const orangeLight = new THREE.PointLight(0xf97316, 120, 0, 2);
      orangeLight.position.set(5, 3, 3);
      scene.add(orangeLight);
      const yellowLight = new THREE.PointLight(0xfbbf24, 100, 0, 2);
      yellowLight.position.set(-5, -2, 3);
      scene.add(yellowLight);
      const pinkLight = new THREE.PointLight(0xec4899, 80, 0, 2);
      pinkLight.position.set(0, 5, -4);
      scene.add(pinkLight);
      const cyanLight = new THREE.PointLight(0x00f2ff, 70, 0, 2);
      cyanLight.position.set(-3, 4, 2);
      scene.add(cyanLight);
      const purpleLight = new THREE.PointLight(0x8b5cf6, 60, 0, 2);
      purpleLight.position.set(2, -3, -2);
      scene.add(purpleLight);

      const floaters = createFloatingObjects(mobile);
      scene.add(floaters.group);
      const particles = createParticleField(mobile ? 200 : 800);
      scene.add(particles.points);

      const mouse = { x: 0, y: 0 };
      const onMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      if (!reduced) window.addEventListener("mousemove", onMove);

      const onResize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(container);

      const clock = new THREE.Clock();
      const camTarget = new THREE.Vector3();
      let raf = 0;

      const renderFrame = (advance: boolean) => {
        if (advance) {
          const dt = Math.min(clock.getDelta(), 0.05);
          const t = clock.elapsedTime;
          floaters.update(t, dt);
          particles.update(dt);
          camTarget.set(mouse.x * 0.9, mouse.y * 0.55, 7.5);
          camera.position.x += (camTarget.x - camera.position.x) * 0.045;
          camera.position.y += (camTarget.y - camera.position.y) * 0.045;
        }
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };

      if (reduced) {
        renderFrame(false);
      } else {
        const loop = () => {
          renderFrame(true);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      }

      cleanup = () => {
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        window.removeEventListener("mousemove", onMove);
        floaters.group.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else material?.dispose();
        });
        particles.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    } catch (error) {
      console.error("HeroScene setup error:", error);
    }

    return cleanup;
  }, [reduced]);

  return <div ref={containerRef} className="h-full w-full" aria-hidden />;
}