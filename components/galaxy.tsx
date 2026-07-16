"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import type { Idea } from "../lib/data";

function Node({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.scale.setScalar(scale + Math.sin(clock.elapsedTime * 1.4 + position[0]) * 0.04);
  });
  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[0.34, 2]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} roughness={0.25} />
    </mesh>
  );
}

export function GalaxyCanvas({ ideas }: { ideas: Idea[] }) {
  const visibleIdeas = useMemo(() => ideas.slice(0, 36), [ideas]);
  const points = useMemo(() => visibleIdeas.map((_, index): [number, number, number] => {
    const angle = index * 2.399963;
    const radius = 0.8 + Math.sqrt(index + 1) * 0.72;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.58, ((index % 7) - 3) * 0.22];
  }), [visibleIdeas]);
  return (
    <div className="galaxy-canvas" role="img" aria-label={`Interactive 3D map of ${visibleIdeas.length} connected idea clusters`}>
      <Canvas camera={{ position: [0, 0, 7], fov: 48 }} dpr={[1, 1.5]}>
        <color attach="background" args={["#050705"]} />
        <ambientLight intensity={0.45} />
        <pointLight position={[3, 3, 4]} intensity={25} color="#b6ff3b" />
        <Sparkles count={90} size={1.2} scale={[8, 5, 4]} speed={0.25} color="#b6ff3b" />
        {points.map((point, index) => <Node key={visibleIdeas[index].id} position={point} color={visibleIdeas[index].accent} scale={0.68 + visibleIdeas[index].trend / 220} />)}
        <OrbitControls enablePan enableZoom minDistance={4} maxDistance={11} autoRotate autoRotateSpeed={0.25} />
      </Canvas>
    </div>
  );
}
