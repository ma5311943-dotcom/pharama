"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

const PillModel = ({ position, rotationSpeed, floatSpeed, delay }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    groupRef.current.rotation.x += delta * rotationSpeed.x;
    groupRef.current.rotation.y += delta * rotationSpeed.y;
    groupRef.current.rotation.z += delta * rotationSpeed.z;
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={1.5} floatIntensity={2} floatingRange={[-0.5, 0.5]}>
      <group ref={groupRef} position={position} scale={0.6}>
        {}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 1.2, 32]} />
          <meshPhysicalMaterial color="#00a8e8" metalness={0.2} roughness={0.1} clearcoat={1} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color="#00a8e8" metalness={0.2} roughness={0.1} clearcoat={1} />
        </mesh>

        {}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 1.2, 32]} />
          <meshPhysicalMaterial color="#1a1a1a" metalness={0.5} roughness={0.3} clearcoat={0.5} />
        </mesh>
        <mesh position={[0, -1.2, 0]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color="#1a1a1a" metalness={0.5} roughness={0.3} clearcoat={0.5} />
        </mesh>

        {}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.41, 0.41, 0.05, 32]} />
          <meshStandardMaterial color="#00a8e8" emissive="#00a8e8" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </Float>
  );
};

export default function Hero3DScene() {

  const pills = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5 - 2
      ],
      rotationSpeed: {
        x: (Math.random() - 0.5) * 1.5,
        y: (Math.random() - 0.5) * 1.5,
        z: (Math.random() - 0.5) * 1.5,
      },
      floatSpeed: 1 + Math.random() * 2,
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        
        {pills.map((props, i) => (
          <PillModel key={i} {...props} />
        ))}
      </Canvas>
    </div>
  );
}
