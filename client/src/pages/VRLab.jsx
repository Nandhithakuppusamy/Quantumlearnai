import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Bot,
  Box,
  Cpu,
  Glasses,
  HelpCircle,
  Info,
  Maximize2,
  Orbit,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  X,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLab } from '../context/LabContext';
import { ALGORITHM_PRESETS, circuitToCode, simulateCircuit } from '../utils/quantumSimulator';
import WebXRQuantumLab from '../components/webxr/WebXRQuantumLab';
import { speakAIText, stopSpeech } from '../utils/vrAudio';

const probabilityLabel = (value) => `${Math.round(value * 100)}%`;

export const VRLab = () => {
  const navigate = useNavigate();
  const {
    selectedAlgoKey,
    circuit,
    setCircuit,
    simulationResult,
    setSimulationResult,
    setIsSimulating,
    isSimulating,
    recordMetric
  } = useLab();

  // WebXR Session and Device State
  const [vrSupported, setVrSupported] = useState(null); // null = checking, true = supported, false = unsupported
  const [isInVR, setIsInVR] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState('Detecting WebXR VR hardware...');
  const [vrError, setVrError] = useState(null);
  const [showVRGuide, setShowVRGuide] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);

  const triggerEnterVRRef = useRef(null);
  const preset = ALGORITHM_PRESETS[selectedAlgoKey] || ALGORITHM_PRESETS.bell_state;

  // Runtime WebXR Feature Detection
  useEffect(() => {
    let isMounted = true;

    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      navigator.xr
        .isSessionSupported('immersive-vr')
        .then((supported) => {
          if (!isMounted) return;
          setVrSupported(supported);
          if (supported) {
            setDeviceStatus('WebXR immersive-vr Ready: Headset detected');
          } else {
            setDeviceStatus('VR headset not detected — Desktop 3D mode');
          }
        })
        .catch(() => {
          if (!isMounted) return;
          setVrSupported(false);
          setDeviceStatus('VR headset not detected — Desktop 3D mode');
        });

      const handleDeviceChange = () => {
        navigator.xr?.isSessionSupported('immersive-vr').then((supported) => {
          if (!isMounted) return;
          setVrSupported(supported);
          setDeviceStatus(supported ? 'WebXR immersive-vr Ready: Headset detected' : 'VR headset not detected — Desktop 3D mode');
        });
      };

      navigator.xr.addEventListener?.('devicechange', handleDeviceChange);
      return () => {
        isMounted = false;
        navigator.xr.removeEventListener?.('devicechange', handleDeviceChange);
      };
    } else {
      setVrSupported(false);
      setDeviceStatus('WebXR API not available — Desktop 3D mode');
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Enter VR Action Handler
  const handleEnterVR = async () => {
    setVrError(null);

    if (typeof navigator === 'undefined' || !('xr' in navigator)) {
      setVrError('WebXR is not supported in this browser. Please use Meta Quest Browser, Chrome, Edge, or Wolvic on a VR headset.');
      setShowVRGuide(true);
      return;
    }

    try {
      const supported = await navigator.xr.isSessionSupported('immersive-vr');
      if (!supported) {
        setVrError('No compatible VR headset was detected. Connect your VR headset (e.g. Meta Quest, Apple Vision Pro, SteamVR, Vive, Pico) or use the Desktop 3D mode.');
        setShowVRGuide(true);
        return;
      }

      if (triggerEnterVRRef.current) {
        await triggerEnterVRRef.current();
      }
    } catch (err) {
      console.error('Failed to launch WebXR session:', err);
      setVrError(err.message || 'Failed to initialize immersive-vr session. Ensure VR hardware is powered on and connected.');
      setShowVRGuide(true);
    }
  };

  // Run simulation shared with LabContext
  const runExperiment = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const result = simulateCircuit(circuit);
      setSimulationResult(result);
      setIsSimulating(false);
      recordMetric('experiments');
      recordMetric('vrExperiments');
      toast.success('Simulation updated');
    }, 350);
  };

  const addGate = (gate) => {
    const next = [
      ...circuit,
      {
        id: `step-${circuit.length + 1}`,
        ...(gate === 'CNOT'
          ? { type: 'cnot', control: 0, target: 1 }
          : { q0: gate, q1: null })
      }
    ];
    setCircuit(next);
    setSimulationResult(simulateCircuit(next));
    recordMetric('circuitsModified');
    toast.success(`Added ${gate} gate`);
  };

  const resetBellCircuit = () => {
    const bell = [
      { id: 'step-1', q0: 'H', q1: null },
      { id: 'step-2', type: 'cnot', control: 0, target: 1 },
      { id: 'step-3', q0: 'M', q1: 'M' }
    ];
    setCircuit(bell);
    setSimulationResult(simulateCircuit(bell));
    toast('Reset to Bell State (|Φ⁺⟩)', { icon: '🔄' });
  };

  const explainBellState = () => {
    setIsExplaining(true);
    speakAIText(
      'In the Bell State demonstration, Qubit 0 is first placed into superposition using a Hadamard gate. Next, the CNOT gate entangles Qubit 0 and Qubit 1. Measuring either qubit instantly dictates the outcome of the other, yielding strictly correlated zero-zero or one-one states!'
    );
    setTimeout(() => setIsExplaining(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & VR Launch Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <button
            type="button"
            onClick={() => navigate('/lab')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-cyan-300 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Quantum Lab
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isInVR
                  ? 'bg-emerald-400 animate-ping'
                  : vrSupported
                  ? 'bg-cyan-400 animate-pulse'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              WebXR Immersive VR Laboratory
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1.5 flex items-center gap-3">
            VR Quantum Lab
            {isInVR && (
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                IMMERSIVE SESSION ACTIVE
              </span>
            )}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-1.5 max-w-3xl">
            Walk inside the virtual quantum laboratory with 6DoF headset tracking, VR controllers, hand tracking, and spatial entanglement.
          </p>
        </div>

        {/* Action Controls & ENTER VR Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* WebXR Status Pill */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-mono border ${
              vrSupported
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            }`}
          >
            <Glasses className="w-4 h-4" />
            <span>{deviceStatus}</span>
          </div>

          {/* Help Button */}
          <button
            type="button"
            onClick={() => setShowVRGuide(true)}
            className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
            title="How to connect VR Headset"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Prominent ENTER VR Button */}
          <button
            type="button"
            onClick={handleEnterVR}
            className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-extrabold shadow-quantum-cyan tracking-wider uppercase transition-all duration-300 ${
              isInVR
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 animate-pulse'
                : vrSupported
                ? 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white hover:brightness-110 ring-2 ring-cyan-400/50 hover:scale-105'
                : 'bg-gradient-to-r from-slate-800 to-purple-900/60 text-slate-200 border border-purple-500/40 hover:border-purple-400 hover:text-white'
            }`}
          >
            <Glasses className="w-4 h-4" />
            {isInVR ? 'VR Session Running' : vrSupported ? 'ENTER VR (WebXR)' : 'ENTER VR (Connect Headset)'}
          </button>
        </div>
      </div>

      {/* Mode Clarification Banner */}
      {!vrSupported && (
        <div className="flex items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>
              <strong>VR headset not detected — Desktop 3D mode.</strong> You can explore the room-scale virtual laboratory using mouse/keyboard preview. Connect a WebXR headset (Meta Quest, Vision Pro, SteamVR) and click <strong>ENTER VR</strong> to step inside!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowVRGuide(true)}
            className="underline hover:text-white flex-shrink-0 text-xs sm:text-sm font-semibold ml-2"
          >
            Setup Guide
          </button>
        </div>
      )}

      {/* Main WebXR 3D Spatial Virtual Quantum Laboratory Scene */}
      <WebXRQuantumLab
        circuit={circuit}
        setCircuit={setCircuit}
        simulationResult={simulationResult}
        setSimulationResult={setSimulationResult}
        recordMetric={recordMetric}
        onSessionChange={setIsInVR}
        triggerEnterVRRef={triggerEnterVRRef}
      />

      {/* Companion Educational Details & Synchronized Laboratory HUD */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Bell State Demonstration & Circuit Synchronization */}
        <div className="xl:col-span-7 space-y-5">
          <div className="glass-card rounded-2xl border border-slate-800 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5 pb-3.5 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <h2 className="text-base sm:text-lg font-bold text-white">Main Demonstration: Bell State (|Φ⁺⟩)</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Spatial circuit running synchronously in WebXR and the Quantum Lab simulator.
                </p>
              </div>
              <span className="text-xs sm:text-sm font-mono px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-bold">
                |ψ⟩ = (|00⟩ + |11⟩) / √2
              </span>
            </div>

            {/* Circuit Code Preview */}
            <pre className="rounded-xl bg-[#050812] border border-slate-800 p-4 sm:p-5 overflow-x-auto text-sm font-mono leading-relaxed text-cyan-200">
              {circuitToCode(circuit)}
            </pre>

            {/* Quick Gate Modifiers */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-3.5 border-t border-slate-800/60">
              <span className="text-xs sm:text-sm font-semibold text-slate-400 mr-1">Quick Add:</span>
              {['H', 'X', 'Y', 'Z', 'CNOT', 'M'].map((gate) => (
                <button
                  key={gate}
                  type="button"
                  onClick={() => addGate(gate)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm font-mono font-bold text-slate-200 hover:border-cyan-400 hover:text-cyan-300 hover:bg-slate-750 transition-colors"
                >
                  + {gate}
                </button>
              ))}

              <button
                type="button"
                onClick={resetBellCircuit}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-950/70 border border-indigo-500/40 text-sm font-semibold text-indigo-200 hover:text-white hover:bg-indigo-900/80 transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Reset Bell State
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Measurement Results & AI Tutor Narration */}
        <div className="xl:col-span-5 space-y-5">
          {/* Measurement Collapse Results */}
          <div className="glass-card rounded-2xl border border-slate-800 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-300" />
                <h2 className="text-base sm:text-lg font-bold text-white">Measurement Results</h2>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                Shared with Lab
              </span>
            </div>

            <div className="space-y-3.5">
              {Object.entries(simulationResult.probabilities).map(([state, probability]) => (
                <div key={state}>
                  <div className="flex justify-between text-sm mb-1.5 font-mono">
                    <span className="text-slate-200 font-bold">|{state}⟩</span>
                    <span className="font-bold text-cyan-300">{probabilityLabel(probability)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                      style={{ width: `${Math.max(2, probability * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-4 pt-3.5 border-t border-slate-800">
              {simulationResult.probabilities['00'] > 0.4 && simulationResult.probabilities['11'] > 0.4
                ? '★ Entangled Bell correlation: measuring one qubit instantly projects the second into the identical state (50% |00⟩, 50% |11⟩).'
                : 'Modify gates in VR or on this workbench, then observe how state transitions affect probability collapse.'}
            </p>
          </div>

          {/* In-VR AI Tutor Card */}
          <div className="glass-card rounded-2xl border border-purple-500/20 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-300" />
                <h2 className="text-base sm:text-lg font-bold text-white">AI Tutor in VR</h2>
              </div>
              <button
                type="button"
                onClick={explainBellState}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-200 text-xs sm:text-sm font-semibold hover:bg-purple-500/30 transition-colors"
              >
                <Volume2 className="w-4 h-4" /> Read Aloud
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {isExplaining
                ? 'Speaking AI explanation: Hadamard creates superposition (|0⟩+|1⟩)/√2 on q₀. CNOT entangles q₀ and q₁ so measurement yields strictly correlated outcomes.'
                : 'Inside VR, point your controller laser at the 3D AI Tutor holographic board to ask questions, explore superposition, and hear voice explanations.'}
            </p>

            <div className="grid grid-cols-2 gap-2.5 mt-4">
              <button
                type="button"
                onClick={explainBellState}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs sm:text-sm font-bold hover:bg-purple-500/25 transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Explain Bell State
              </button>
              <button
                type="button"
                onClick={runExperiment}
                disabled={isSimulating}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs sm:text-sm font-bold shadow-quantum-cyan disabled:opacity-60 transition-colors"
              >
                <Play className="w-4 h-4 fill-white" /> {isSimulating ? 'Simulating...' : 'Simulate'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VR Connection & Setup Guide Modal */}
      {showVRGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#090e1f] border border-cyan-500/40 p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Glasses className="w-6 h-6 text-cyan-400" />
                <h3 className="text-lg font-extrabold text-white">How to Step into WebXR VR</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVRGuide(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {vrError && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs sm:text-sm leading-relaxed">
                <strong>Hardware notice:</strong> {vrError}
              </div>
            )}

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <strong className="block text-cyan-300 mb-1 text-sm sm:text-base">1. Meta Quest 2 / 3 / Pro</strong>
                <p>Open the native <strong>Meta Quest Browser</strong> inside your headset, navigate to this application URL, and click <strong>ENTER VR</strong>.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <strong className="block text-purple-300 mb-1 text-sm sm:text-base">2. Apple Vision Pro</strong>
                <p>In Safari Settings on visionOS, ensure <strong>WebXR</strong> is enabled in Advanced Settings, then click <strong>ENTER VR</strong>.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <strong className="block text-emerald-300 mb-1 text-sm sm:text-base">3. PCVR (SteamVR, Vive, Oculus Rift)</strong>
                <p>Launch SteamVR or Oculus Link, open this app in Google Chrome or Microsoft Edge, and click <strong>ENTER VR</strong>.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <strong className="block text-amber-300 mb-1 text-sm sm:text-base">4. Desktop Developer Testing</strong>
                <p>Install the free <strong>WebXR API Emulator</strong> extension in Chrome/Firefox to simulate 6DoF headsets, motion controllers, and hand tracking directly on your desktop PC!</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowVRGuide(false)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-white text-sm font-bold hover:bg-cyan-400 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VRLab;