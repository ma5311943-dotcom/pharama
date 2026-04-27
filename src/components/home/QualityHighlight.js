"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Globe } from 'lucide-react';

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#0077b6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00b4a6" />

      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere args={[1, 64, 64]} scale={1.8}>
          <MeshDistortMaterial
            color="#0077b6"
            speed={3}
            distort={0.4}
            radius={1}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.6}
          />
        </Sphere>
      </Float>

      <Float speed={4} rotationIntensity={2} floatIntensity={4}>
        <Sphere args={[0.8, 32, 32]} scale={1} position={[2, 1, -1]}>
          <MeshWobbleMaterial
            color="#00b4a6"
            speed={2}
            factor={0.5}
            transparent
            opacity={0.4}
          />
        </Sphere>
      </Float>
    </>
  );
};

const QualityHighlight = () => {
  return (
    <section
      id="quality-section"
      className="relative min-h-screen py-24 flex items-center bg-bg-page text-white overflow-hidden"
    >
      {/* Background Tech Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#0077b622_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_center,_#00b4a611_0%,transparent_70%)]" />
      </div>

      {/* 3D Experience (Using React Three Fiber for 'Best' Performance) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 hidden md:block">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold mb-6 uppercase tracking-[0.2em]">
            <ShieldCheck className="w-3 h-3" />
            Quality Assurance
          </div>
          <h2 className="text-3xl lg:text-5xl font-black mb-6 tracking-tight">
            Tested for <span className="text-primary">Perfection</span>
          </h2>
          <p className="text-[13px] lg:text-[15px] opacity-60 leading-relaxed max-w-xl mx-auto uppercase tracking-wider">
            Every bottle undergoes rigorous clinical testing and quality checks before it reaches your doorstep. We never compromise on your health.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {[
            {
              icon: <Award className="w-5 h-5" />,
              title: "FDA Approved",
              desc: "Completely safe for children and adults with zero harmful additives."
            },
            {
              icon: <Globe className="w-5 h-5" />,
              title: "Global Standard",
              desc: "Trusted by millions across the globe for consistent reliability."
            },
            {
              icon: <ShieldCheck className="w-5 h-5" />,
              title: "Purity Locked",
              desc: "Tamper-proof packaging ensuring original seal for every unit."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2.5rem] bg-bg-card/[0.03] backdrop-blur-3xl border border-border-nav/10 hover:bg-bg-card/[0.06] hover:border-primary/30 transition-all duration-500 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,119,182,0.3)]">
                {item.icon}
              </div>
              <h3 className="text-[18px] font-bold mb-3 tracking-wide">{item.title}</h3>
              <p className="text-[12px] opacity-50 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* The traveling bottle from page.js will rotate in the space below */}
        <div className="h-[200px] lg:h-[300px]" />
      </div>
    </section>
  );
};

export default QualityHighlight;
