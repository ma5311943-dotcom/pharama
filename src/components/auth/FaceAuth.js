"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanFace, X, Loader2, CameraOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';

import * as faceapi from 'face-api.js';

const MODEL_URL = process.env.NEXT_PUBLIC_FACE_API_MODEL_URL || '/models';

const FaceAuth = ({ isRegister = false, onClose }) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const webcamRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error('Failed to load face-api models', err);
        toast.error('Failed to initialize AI models');
      }
    };
    loadModels();
  }, []);

  const handleUserMediaError = useCallback(() => {
    setHasCamera(false);
    toast.error('No Camera Access');
  }, []);

  const captureAndProcess = async () => {
    if (isRegister && (!email || !name)) {
      toast.error('Name and Email are required to register');
      return;
    }
    if (!isRegister && !email) {
      toast.error('Email is required to login');
      return;
    }

    if (!webcamRef.current || !modelsLoaded) return;

    setIsScanning(true);
    
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        toast.error('Failed to capture image');
        setIsScanning(false);
        return;
      }

      const img = new Image();
      img.src = imageSrc;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        toast.error('Face Not Recognized. Please align your face.');
        setIsScanning(false);
        return;
      }

      const descriptorArray = Array.from(detection.descriptor);

      if (isRegister) {
        const res = await axios.post('/api/auth/face-register', {
          name,
          email,
          image: imageSrc,
          faceDescriptor: descriptorArray
        });

        if (res.data.success) {
          toast.success('Registration successful!');
          dispatch(setCredentials(res.data.user));
          router.push('/');
          if (onClose) onClose();
        }
      } else {
        const res = await axios.post('/api/auth/face-login', {
          email,
          faceDescriptor: descriptorArray
        });

        if (res.data.success) {
          toast.success('Login successful!');
          dispatch(setCredentials(res.data.user));
          router.push('/');
          if (onClose) onClose();
        }
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Authentication failed';
      toast.error(msg);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#0a0a0a] border border-[#27272a] p-6 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <ScanFace className="text-[#00a8e8] w-6 h-6" />
            Face {isRegister ? 'Registration' : 'Login'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Secure biometric authentication
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-[#27272a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00a8e8] transition-colors"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-[#27272a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00a8e8] transition-colors"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="relative aspect-square w-full rounded-[12px] overflow-hidden bg-black border border-[#27272a] mb-6 flex items-center justify-center group">
          {!hasCamera ? (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <CameraOff className="w-12 h-12 mb-2" />
              <span>Camera not found</span>
            </div>
          ) : (
            <>
              {modelsLoaded ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  onUserMediaError={handleUserMediaError}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#00a8e8]">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <span className="text-sm font-medium">Loading AI Models...</span>
                </div>
              )}

              <AnimatePresence>
                {isScanning && (
                  <motion.div 
                    initial={{ top: '0%' }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-[#00a8e8] shadow-[0_0_15px_#00a8e8] z-10"
                  />
                )}
              </AnimatePresence>
              
              <div className="absolute inset-0 border-4 border-transparent group-hover:border-[#00a8e8]/30 transition-colors rounded-[12px] pointer-events-none z-10" />
            </>
          )}
        </div>

        <button
          onClick={captureAndProcess}
          disabled={!modelsLoaded || isScanning || !hasCamera}
          className="w-full bg-[#00a8e8] hover:bg-[#0096c7] disabled:bg-[#00a8e8]/50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_0_rgba(0,168,232,0.39)]"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ScanFace className="w-5 h-5" />
              {isRegister ? 'Register Face' : 'Login with Face'}
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default FaceAuth;
