"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, verifyOtpAction, clearError } from '@/redux/slices/authSlice';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Mail, Lock, User, ArrowRight, HeartPulse, Activity, Stethoscope, Pill, ChevronLeft, ShieldCheck, Loader2, ScanFace } from 'lucide-react';
import toast from 'react-hot-toast';
import FaceAuth from '@/components/auth/FaceAuth';

const floatingIcons = [
  { Icon: Pill, top: '8%', left: '6%', size: 24, delay: 0 },
  { Icon: HeartPulse, top: '20%', left: '91%', size: 28, delay: 1 },
  { Icon: ShieldCheck, top: '62%', left: '6%', size: 22, delay: 0.6 },
  { Icon: Activity, top: '79%', left: '88%', size: 26, delay: 2 },
  { Icon: Stethoscope, top: '50%', left: '93%', size: 18, delay: 0.3 },
  { Icon: Pill, top: '86%', left: '21%', size: 20, delay: 1.7 },
  { Icon: HeartPulse, top: '13%', left: '70%', size: 16, delay: 2.7 },
  { Icon: Activity, top: '43%', left: '2%', size: 14, delay: 1.2 },
];

export default function RegisterPage() {
  const orbitRefs = useRef([]);
  const coreRef = useRef(null);
  const iconRefs = useRef([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showFaceAuth, setShowFaceAuth] = useState(false);

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
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const result = await dispatch(registerUser({ name, email, password }));
    if (!result.error) {
      toast.success('OTP sent to your email!');
      setRegisteredEmail(email);
      setStep(2);
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    const result = await dispatch(verifyOtpAction({ email: registeredEmail, otp }));
    if (!result.error) {
      toast.success('Account verified and logged in!');
      router.push('/');
    } else {
      toast.error(result.payload || 'Verification failed');
    }
  };

  useEffect(() => {
    gsap.to(coreRef.current, {
      scale: 1.2,
      opacity: 0.65,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const configs = [
      { rotationY: -360, duration: 4 },
      { rotationX: -360, duration: 5.5 },
      { rotation: -360, duration: 3 },
      { rotationY: 360, rotationX: -120, duration: 9 },
    ];
    orbitRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, { ...configs[i], repeat: -1, ease: "none" });
    });

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
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-5 relative overflow-hidden">

      <div className="absolute top-[-12%] right-[-8%] w-[380px] h-[380px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-12%] left-[-8%] w-[420px] h-[420px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {floatingIcons.map(({ Icon, top, left, size }, i) => (
        <div key={i} ref={el => iconRefs.current[i] = el} className="absolute text-secondary/35 pointer-events-none" style={{ top, left }}>
          <Icon size={size} strokeWidth={1.5} />
        </div>
      ))}

      {}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="w-full max-w-[820px] bg-bg-card/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_70px_-15px_rgba(0,180,166,0.12)] border border-border-nav/80 flex flex-col lg:flex-row overflow-hidden"
      >
        {}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-10">
          <div className="max-w-[270px] mx-auto w-full">
            <div className="mb-6">
              <h1 className="text-[30px] font-semibold text-text-heading mb-1">Create account</h1>
              <p className="text-[11px] font-medium text-text-muted uppercase tracking-widest">Join the PharmaEase family</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-[11px] p-3 rounded-xl mb-4 font-medium">
                {error}
              </div>
            )}

            {step === 1 ? (
              <form className="space-y-3" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-[10px] text-text-muted uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-bg-page/80 border border-border-nav rounded-xl pl-10 pr-3 py-3 text-[13px] focus:outline-none focus:border-secondary focus:bg-bg-card transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-text-muted uppercase tracking-widest mb-1.5 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full bg-bg-page/80 border border-border-nav rounded-xl pl-10 pr-3 py-3 text-[13px] focus:outline-none focus:border-secondary focus:bg-bg-card transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-text-muted uppercase tracking-widest mb-1.5 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-bg-page/80 border border-border-nav rounded-xl pl-10 pr-3 py-3 text-[13px] focus:outline-none focus:border-secondary focus:bg-bg-card transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1 px-1">
                  <input type="checkbox" required className="w-3.5 h-3.5 rounded border-border-nav text-secondary focus:ring-secondary cursor-pointer" />
                  <span className="text-[10px] text-text-muted uppercase tracking-widest">
                    Agree to <Link href="#" className="text-secondary hover:underline">Terms</Link> &amp; <Link href="#" className="text-secondary hover:underline">Privacy</Link>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-secondary text-white py-3.5 rounded-xl font-medium text-[13px] hover:opacity-90 transition-all shadow-lg shadow-secondary/15 flex items-center justify-center gap-2 mt-1 active:scale-95 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-border-nav"></div>
                  <span className="flex-shrink-0 mx-2 text-[10px] text-text-muted uppercase tracking-widest">Or</span>
                  <div className="flex-grow border-t border-border-nav"></div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFaceAuth(true)}
                  className="w-full bg-bg-card border border-secondary text-secondary py-3.5 rounded-xl font-medium text-[13px] hover:bg-secondary/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ScanFace className="w-4 h-4" />
                  Register with Face
                </button>
              </form>
            ) : (
              <form className="space-y-3" onSubmit={handleVerify}>
                <div>
                  <label className="block text-[10px] text-text-muted uppercase tracking-widest mb-1.5 ml-1">Enter OTP sent to {registeredEmail}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-bg-page/80 border border-border-nav rounded-xl pl-10 pr-3 py-3 text-[13px] focus:outline-none focus:border-secondary focus:bg-bg-card transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-secondary text-white py-3.5 rounded-xl font-medium text-[13px] hover:opacity-90 transition-all shadow-lg shadow-secondary/15 flex items-center justify-center gap-2 mt-1 active:scale-95 cursor-pointer disabled:opacity-70"
                >
                  Verify Account
                </button>
              </form>
            )}

            <p className="mt-7 text-center text-[11px] text-text-muted">
              Already a member?{' '}
              <Link href="/login" className="text-secondary  font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>

        {}
        <div className="flex flex-col items-center justify-center bg-gradient-to-bl from-secondary/5 via-bg-page/30 to-primary/5 p-8 border-t lg:border-t-0 lg:border-l border-border-nav/50 lg:w-[42%] relative overflow-hidden order-first lg:order-last">

          {}
          <div className="relative w-44 h-44 mb-10 flex items-center justify-center" style={{ perspective: '600px' }}>
            <div ref={coreRef} className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary opacity-80 shadow-[0_0_30px_rgba(0,180,166,0.5)]" />

            <div ref={el => orbitRefs.current[0] = el} className="absolute w-44 h-44 rounded-full border-2 border-secondary/30" style={{ transformStyle: 'preserve-3d' }} />
            <div ref={el => orbitRefs.current[1] = el} className="absolute w-32 h-32 rounded-full border-2 border-primary/40" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg)' }} />
            <div ref={el => orbitRefs.current[2] = el} className="absolute w-24 h-24 rounded-full border border-secondary/20" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(45deg)' }} />
            <div ref={el => orbitRefs.current[3] = el} className="absolute w-[170px] h-[170px] rounded-full border border-dashed border-primary/20" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(30deg) rotateY(60deg)' }} />

            <div className="absolute w-44 h-44 rounded-full" style={{ animation: 'spin 4s linear infinite' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-secondary shadow-[0_0_8px_rgba(0,180,166,0.9)]" />
            </div>
            <div className="absolute w-32 h-32 rounded-full" style={{ animation: 'spin 5.5s linear infinite reverse' }}>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,119,182,0.9)]" />
            </div>
          </div>

          <h2 className="text-[30px] font-bold text-text-heading text-center mb-2">
            Start Your <span className="text-secondary">Journey</span>
          </h2>
          <p className="text-[12px] font-normal text-text-muted text-center max-w-[180px] leading-relaxed">
            Join 50,000+ families who trust PharmaEase
          </p>

          <div className="mt-7 flex flex-col gap-2.5 w-full">
            {[{ icon: ShieldCheck, text: "Verified medicines only" }, { icon: Stethoscope, text: "Expert pharmacist support" }].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-bg-card/60 rounded-xl px-3 py-2 border border-border-nav">
                <Icon className="w-3.5 h-3.5 text-secondary shrink-0" />
                <span className="text-[15px] font-medium text-text-muted">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Link href="/" className="absolute font-medium bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-text-muted hover:text-secondary transition-colors text-[11px] uppercase tracking-widest group">
        <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
        Back to Pharmacy
      </Link>

      {showFaceAuth && (
        <FaceAuth isRegister={true} onClose={() => setShowFaceAuth(false)} />
      )}
    </div>
  );
}
