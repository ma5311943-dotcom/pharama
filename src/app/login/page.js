"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, verifyOtpAction, clearError } from '@/redux/slices/authSlice';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Mail, Lock, ArrowRight, HeartPulse, Activity, Stethoscope, Pill, ChevronLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const floatingIcons = [
  { Icon: Pill, top: '10%', left: '5%', size: 24, delay: 0 },
  { Icon: HeartPulse, top: '22%', left: '90%', size: 28, delay: 1 },
  { Icon: Stethoscope, top: '65%', left: '7%', size: 22, delay: 0.7 },
  { Icon: Activity, top: '80%', left: '87%', size: 26, delay: 2 },
  { Icon: Pill, top: '50%', left: '93%', size: 18, delay: 0.4 },
  { Icon: HeartPulse, top: '87%', left: '20%', size: 20, delay: 1.6 },
  { Icon: Stethoscope, top: '14%', left: '68%', size: 16, delay: 2.8 },
  { Icon: Activity, top: '44%', left: '2%', size: 14, delay: 1.3 },
];

export default function LoginPage() {
  const orbitRefs = useRef([]);
  const coreRef = useRef(null);
  const iconRefs = useRef([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [loginEmail, setLoginEmail] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [user, router, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const result = await dispatch(loginUser({ email, password }));
    if (!result.error) {
      if (result.payload.requireOtp) {
        toast.success('OTP sent to your email!');
        setLoginEmail(email);
        setStep(2);
      } else {
        toast.success('Welcome back!');
        router.push('/');
      }
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    const result = await dispatch(verifyOtpAction({ email: loginEmail, otp }));
    if (!result.error) {
      toast.success('Verified and logged in!');
      router.push('/');
    } else {
      toast.error(result.payload || 'Verification failed');
    }
  };

  useEffect(() => {
    // Pulse the core orb
    gsap.to(coreRef.current, {
      scale: 1.15,
      opacity: 0.7,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Orbit rings at different speeds + axes
    const configs = [
      { rotationY: 360, duration: 4 },
      { rotationX: 360, duration: 6 },
      { rotation: 360, duration: 3 },
      { rotationY: -360, rotationX: 120, duration: 8 },
    ];
    orbitRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        ...configs[i],
        repeat: -1,
        ease: "none",
      });
    });

    // Floating background icons
    iconRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        y: "random(-20, 20)",
        x: "random(-12, 12)",
        rotation: "random(-25, 25)",
        duration: "random(2.5, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: floatingIcons[i]?.delay || 0,
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF5FF] via-[#F5FFFE] to-[#EEF5FF] flex items-center justify-center p-5 relative overflow-hidden">

      {/* Ambient light blobs */}
      <div className="absolute top-[-12%] left-[-8%] w-[380px] h-[380px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-12%] right-[-8%] w-[420px] h-[420px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating icons */}
      {floatingIcons.map(({ Icon, top, left, size }, i) => (
        <div key={i} ref={el => iconRefs.current[i] = el} className="absolute text-primary/35 pointer-events-none" style={{ top, left }}>
          <Icon size={size} strokeWidth={1.5} />
        </div>
      ))}

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="w-full max-w-[820px] bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_70px_-15px_rgba(0,119,182,0.12)] border border-white/80 flex flex-col lg:flex-row overflow-hidden"
      >
        {/* Left visual */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-white/30 to-secondary/5 p-8 border-b lg:border-b-0 lg:border-r border-white/50 lg:w-[42%] relative overflow-hidden">

          {/* Animated Atom / DNA Rings */}
          <div className="relative w-44 h-44 mb-10 flex items-center justify-center" style={{ perspective: '600px' }}>

            {/* Core pulsing orb */}
            <div ref={coreRef} className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary opacity-80 shadow-[0_0_30px_rgba(0,119,182,0.5)]" />

            {/* Ring 1 */}
            <div ref={el => orbitRefs.current[0] = el} className="absolute w-44 h-44 rounded-full border-2 border-primary/30" style={{ transformStyle: 'preserve-3d' }} />
            {/* Ring 2 */}
            <div ref={el => orbitRefs.current[1] = el} className="absolute w-32 h-32 rounded-full border-2 border-secondary/40" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg)' }} />
            {/* Ring 3 */}
            <div ref={el => orbitRefs.current[2] = el} className="absolute w-24 h-24 rounded-full border border-primary/20" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(45deg)' }} />
            {/* Ring 4 — outermost */}
            <div ref={el => orbitRefs.current[3] = el} className="absolute w-[170px] h-[170px] rounded-full border border-dashed border-secondary/20" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(30deg) rotateY(60deg)' }} />

            {/* Orbiting dots on ring 1 */}
            <div className="absolute w-44 h-44 rounded-full" style={{ animation: 'spin 4s linear infinite' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(0,119,182,0.8)]" />
            </div>
            <div className="absolute w-32 h-32 rounded-full" style={{ animation: 'spin 6s linear infinite reverse' }}>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(0,180,166,0.8)]" />
            </div>
          </div>

          <h2 className="text-[30px] font-bold text-text-heading text-center mb-2">
            Pharma<span className="text-primary">Ease</span>
          </h2>
          <p className="text-[12px] font-normal text-text-muted text-center max-w-[180px] leading-relaxed">
            Your trusted digital pharmacy for professional 24/7 care
          </p>

          <div className="mt-7 flex flex-col gap-2.5 w-full">
            {[{ icon: HeartPulse, text: "Real-time health tracking" }, { icon: Stethoscope, text: "Expert consultations" }].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/60 rounded-xl px-3 py-2 border border-white">
                <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-[15px] font-medium text-text-muted">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-10">
          <div className="max-w-[270px] mx-auto w-full">
            <div className="mb-7">
              {/* less bold + slightly bigger */}
              <h1 className="text-[30px] font-semibold text-text-heading mb-1">Welcome back</h1>

              {/* slightly bigger */}
              <p className="text-[11px] text-text-muted uppercase tracking-widest">
                Sign in to continue
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-[11px] p-3 rounded-xl mb-4 font-medium">
                {error}
              </div>
            )}

            {step === 1 ? (
              <form className="space-y-3.5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-[10px] text-text-muted uppercase tracking-widest mb-1.5 ml-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full bg-gray-50/80 border border-gray-100 rounded-xl pl-10 pr-3 py-3 text-[13px] focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5 px-1">
                    <label className="text-[10px] text-text-muted uppercase tracking-widest">
                      Password
                    </label>

                    <Link href="#" className="text-[9px] text-primary uppercase hover:underline">
                      Forgot?
                    </Link>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50/80 border border-gray-100 rounded-xl pl-10 pr-3 py-3 text-[13px] focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-medium text-[13px] hover:bg-primary-hover transition-all shadow-lg shadow-primary/15 flex items-center justify-center gap-2 mt-1 active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form className="space-y-3.5" onSubmit={handleVerify}>
                <div>
                  <label className="block text-[10px] text-text-muted uppercase tracking-widest mb-1.5 ml-1">
                    Enter OTP sent to {loginEmail}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-gray-50/80 border border-gray-100 rounded-xl pl-10 pr-3 py-3 text-[13px] focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-medium text-[13px] hover:bg-primary-hover transition-all shadow-lg shadow-primary/15 flex items-center justify-center gap-2 mt-1 active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Verify and Login
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}


            <p className="mt-7 text-center text-[11px] text-text-muted">
              New here?{' '}
              {/* less bold */}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Link href="/" className="absolute font-medium bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-text-muted hover:text-primary transition-colors text-[11px] uppercase tracking-widest group">
        <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
        Back to Pharmacy
      </Link>
    </div>
  );
}
