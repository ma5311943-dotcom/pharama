"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Award, Shield, Star, CheckCircle } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const teamData = [
  {
    name: "Mohsin Shafiq",
    role: "Co-Founder & Chief Visionary",
    image: "/assets/mohsin.jpeg",
    achievements: [
      "10+ Years in Healthcare Innovation",
      "Award-winning Pharmaceutical Strategist",
      "Pioneer of Digital Pharmacy Solutions"
    ],
    icon: <Shield className="w-4 h-4 text-primary" />,
    accent: "from-primary to-primary/60"
  },
  {
    name: "Adnan Golona",
    role: "Lead Healthcare Director",
    image: "/assets/golona.jpeg",
    achievements: [
      "Certified Clinical Expert",
      "Spearheaded Global Health Initiatives",
      "Top 1% Healthcare Executives 2023"
    ],
    icon: <Award className="w-4 h-4 text-secondary" />,
    accent: "from-secondary to-secondary/60"
  }
];

const Team = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        '.team-title',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
        }
      );

      gsap.fromTo(
        cardsRef.current[0],
        { x: '-110vw', opacity: 0 },
        {
          x: '0vw', opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "top 30%",
            scrub: 1,
          }
        }
      );

      gsap.fromTo(
        cardsRef.current[1],
        { x: '110vw', opacity: 0 },
        {
          x: '0vw', opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "top 30%",
            scrub: 1,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e, idx) => {
    const card = cardsRef.current[idx];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -8;
    const rotateY = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025,1.025,1.025)`;
  };

  const handleMouseLeave = (idx) => {
    const card = cardsRef.current[idx];
    if (!card) return;
    card.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
  };

  return (
    <section ref={sectionRef} className="py-16 bg-gradient-to-b from-bg-card to-bg-page overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">

        {}
        <div className="text-center max-w-xl mx-auto mb-10 team-title">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
            <Star className="w-4 h-4" />
            Leadership
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-text-heading mb-3 tracking-tight">
            Meet the Visionaries
          </h2>
          <p className="text-sm text-text-body/70">
            Driving the future of accessible, premium healthcare with unmatched expertise and passion.
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {teamData.map((member, idx) => (
            <div
              key={idx}
              ref={el => cardsRef.current[idx] = el}
              onMouseMove={e => handleMouseMove(e, idx)}
              onMouseLeave={() => handleMouseLeave(idx)}
              style={{ transition: 'box-shadow 0.3s ease', willChange: 'transform' }}
              className="group relative rounded-2xl bg-bg-card border border-border-nav shadow-lg hover:shadow-2xl overflow-hidden cursor-default"
            >
              {}
              <div className={`h-1 w-full bg-gradient-to-r ${member.accent}`} />

              {}
              <div className="p-5 flex flex-col items-center text-center">

                {}
                <div className="relative mb-4">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.accent} blur-md opacity-40 scale-110`} />
                  <div className="relative w-60 h-60 rounded-full overflow-hidden ring-4 ring-border-nav shadow-xl">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-bg-card rounded-full p-1.5 shadow-lg border border-border-nav">
                    {member.icon}
                  </div>
                </div>

                {}
                <h3 className="text-lg font-black text-text-heading leading-tight">{member.name}</h3>
                <p className="text-primary font-semibold text-[10px] uppercase tracking-widest mt-0.5 mb-4">
                  {member.role}
                </p>

                {}
                <div className="w-10 h-px bg-border-nav mb-4" />

                {}
                <ul className="space-y-2 text-left w-full">
                  {member.achievements.map((ach, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-text-body text-xs font-medium">{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${member.accent} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Team;