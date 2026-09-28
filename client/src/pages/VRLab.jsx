import React, { Suspense, lazy, useCallback, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Bot, Cpu, Hand, Headset, Monitor, Orbit, Play, RotateCcw, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLab } from '../context/LabContext';
import { ALGORITHM_PRESETS, circuitToCode, simulateCircuit } from '../utils/quantumSimulator';
import { ALGORITHM_TUTOR_CONTEXT } from '../utils/aiTutorEngine';
import { useWebXRSupport } from '../vr/useWebXRSupport';

// Three.js only ships to students who actually open the VR lab.
const QuantumVRStage = lazy(() => import('../components/QuantumVRStage'));

const probabilityLabel = (value) => `${Math.round(value * 100)}%`;

// New gates belong before the trailing measurement step so the circuit stays valid.
const insertStep = (circuit, step) => {
  const measureIndex = circuit.findIndex((item) => item?.q0 === 'M' || item?.q1 === 'M');
  const next = [...circuit];
  next.splice(measureIndex === -1 ? next.length : measureIndex, 0, step);
  return next.map((item, index) => ({ ...item, id: `step-${index + 1}` }));
};

const sampleOutcome = (probabilities = {}) => {
  const roll = Math.random();
  let cumulative = 0;
  for (const basis of ['00', '01', '10', '11']) {
    cumulative += probabilities[basis] || 0;
    if (roll <= cumulative) return basis;
  }
  return '00';
};

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
  const { status: xrStatus, reason: xrReason, isSupported } = useWebXRSupport();
  const [isPresenting, setIsPresenting] = useState(false);
  const [showClassicView, setShowClassicView] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [stageStatus, setStageStatus] = useState('');
  const sceneRef = useRef(null);
  const preset = ALGORITHM_PRESETS[selectedAlgoKey] || ALGORITHM_PRESETS.bell_state;
  const tutorContext = ALGORITHM_TUTOR_CONTEXT[selectedAlgoKey] || ALGORITHM_TUTOR_CONTEXT.bell_state;

  const runExperiment = useCallback(() => {
    setIsSimulating(true);
    sceneRef.current?.playRunAnimation();
    setStageStatus('Running the circuit — watch q0 enter superposition.');
    setTimeout(() => {
      setSimulationResult(simulateCircuit(circuit));
      setIsSimulating(false);
      recordMetric('experiments');
      recordMetric('vrExperiments');
      setStageStatus('Simulation complete — measure the qubits to collapse the state.');
      if (!isPresenting) toast.success('Experiment complete');
    }, 350);
  }, [circuit, isPresenting, recordMetric, setIsSimulating, setSimulationResult]);

  const measure = useCallback(() => {
    const outcome = sampleOutcome(simulationResult?.probabilities);
    sceneRef.current?.showMeasurement(outcome);
    setStageStatus(`Measured |${outcome}⟩ — run again to sample a different outcome.`);
    if (!isPresenting) toast(`Measured |${outcome}⟩`, { icon: '🎯' });
  }, [isPresenting, simulationResult]);

  const resetCircuit = useCallback(() => {
    setCircuit(preset.circuit);
    setSimulationResult(simulateCircuit(preset.circuit));
    setStageStatus(`${preset.name} reloaded — q0: H then CNOT onto q1.`);
  }, [preset, setCircuit, setSimulationResult]);

  const explain = useCallback(() => {
    setExplanation({ title: 'AI tutor', body: tutorContext.summary });
    setStageStatus('AI tutor panel updated.');
  }, [tutorContext]);

  const placeGate = useCallback((gate, qubitIndex) => {
    const next = insertStep(circuit, {
      q0: qubitIndex === 0 ? gate : null,
      q1: qubitIndex === 1 ? gate : null
    });
    setCircuit(next);
    setSimulationResult(simulateCircuit(next));
    recordMetric('circuitsModified');
  }, [circuit, recordMetric, setCircuit, setSimulationResult]);

  const placeCnot = useCallback((controlIndex) => {
    const next = insertStep(circuit, {
      type: 'cnot',
      control: controlIndex,
      target: controlIndex === 0 ? 1 : 0
    });
    setCircuit(next);
    setSimulationResult(simulateCircuit(next));
    recordMetric('circuitsModified');
  }, [circuit, recordMetric, setCircuit, setSimulationResult]);

  const handleAction = useCallback((action) => {
    if (action === 'run') runExperiment();
    else if (action === 'measure') measure();
    else if (action === 'reset') resetCircuit();
    else if (action === 'explain') explain();
  }, [explain, measure, resetCircuit, runExperiment]);

  const enterVR = async () => {
    try {
      await sceneRef.current?.enterVR();
    } catch (error) {
      toast.error(error?.message || 'Could not start the immersive session.');
    }
  };

  const modeBadge = useMemo(() => {
    if (xrStatus === 'checking') return { label: 'Checking for a VR headset…', tone: 'text-slate-300 border-slate-700 bg-slate-900' };
    if (isSupported) {
      return isPresenting
        ? { label: 'Immersive VR session active', tone: 'text-emerald-200 border-emerald-500/40 bg-emerald-500/10' }
        : { label: 'VR headset detected — immersive-vr ready', tone: 'text-purple-200 border-purple-500/40 bg-purple-500/10' };
    }
    return { label: 'VR headset not detected — Desktop 3D mode', tone: 'text-amber-200 border-amber-500/40 bg-amber-500/10' };
  }, [isPresenting, isSupported, xrStatus]);

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <button type="button" onClick={() => navigate('/lab')} className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-300 mb-3">
            <ArrowLeft className="w-4 h-4" /> Return to Quantum Lab
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Immersive WebXR lab</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">VR Quantum Lab</h1>
          <p className="text-sm text-slate-300 mt-1">Step inside the laboratory and build the same circuit with your hands or controllers.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${modeBadge.tone}`}>
            {isSupported ? <Headset className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />} {modeBadge.label}
          </span>
          <button
            type="button"
            onClick={enterVR}
            disabled={!isSupported || isPresenting}
            title={isSupported ? 'Start an immersive-vr session' : xrReason}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold shadow-quantum-cyan disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Headset className="w-3.5 h-3.5" /> {isPresenting ? 'In VR' : 'Enter VR'}
          </button>
          <button type="button" onClick={runExperiment} disabled={isSimulating} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold disabled:opacity-60">
            <Play className="w-3.5 h-3.5" /> {isSimulating ? 'Running...' : 'Run experiment'}
          </button>
        </div>
      </div>

      {!isSupported && xrStatus !== 'checking' && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-amber-100/90 leading-relaxed">
          <strong className="block text-sm text-amber-200 mb-1">Desktop 3D mode (not immersive VR)</strong>
          {xrReason} You can still orbit the laboratory with the mouse, click a gate to pick it up, and click a qubit to place it.
          Open this page in a WebXR browser on a headset — over HTTPS — to enter the immersive experience.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-5">
          <Suspense fallback={<div className="w-full h-[52vh] min-h-[340px] rounded-3xl border border-purple-500/20 bg-[#05070f] flex items-center justify-center text-xs text-slate-400">Loading the immersive laboratory…</div>}>
          <QuantumVRStage
            circuit={circuit}
            result={simulationResult}
            explanation={explanation}
            status={stageStatus || (isSupported
              ? 'Headset ready — press Enter VR to step inside the laboratory.'
              : 'Desktop 3D mode — drag to look around, click a gate then a qubit.')}
            onPlaceGate={placeGate}
            onPlaceCnot={placeCnot}
            onAction={handleAction}
            onSessionChange={setIsPresenting}
            onSceneReady={(scene) => { sceneRef.current = scene; }}
          />
          </Suspense>

          <div className="glass-card rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h2 className="text-sm font-bold text-white">Bell State demonstration</h2>
                <p className="text-xs text-slate-400 mt-1">Grab H → drop on q0. Grab CNOT → drop on q0 to link q0 and q1. Then Run and Measure.</p>
              </div>
              <span className="text-xs font-mono text-cyan-300 whitespace-nowrap">|ψ⟩ = (|00⟩ + |11⟩) / √2</span>
            </div>
            <pre className="rounded-xl bg-[#050812] border border-slate-800 p-4 overflow-x-auto text-xs leading-6 text-cyan-200">{circuitToCode(circuit)}</pre>
            <div className="flex flex-wrap gap-2 mt-4">
              {['H', 'X', 'Z', 'CNOT'].map((gate) => (
                <button
                  key={gate}
                  type="button"
                  onClick={() => (gate === 'CNOT' ? placeCnot(0) : placeGate(gate, 0))}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
                >
                  + {gate}
                </button>
              ))}
              <button type="button" onClick={measure} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-amber-200 hover:text-amber-100">
                <Zap className="inline w-3.5 h-3.5 mr-1" /> Measure
              </button>
              <button type="button" onClick={resetCircuit} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white">
                <RotateCcw className="inline w-3.5 h-3.5 mr-1" /> Reset Bell circuit
              </button>
              <button type="button" onClick={() => setShowClassicView((value) => !value)} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white">
                <Orbit className="inline w-3.5 h-3.5 mr-1" /> {showClassicView ? 'Hide' : 'Show'} classic view
              </button>
            </div>
          </div>

          {showClassicView && (
            <div className="vr-stage rounded-3xl border border-purple-500/30 overflow-hidden relative min-h-[320px]">
              <div className="absolute inset-0 vr-grid opacity-40" />
              <div className="relative z-10 p-5 sm:p-7">
                <div className="flex items-center justify-between text-xs mb-7">
                  <span className="inline-flex items-center gap-2 text-purple-200"><Orbit className="w-4 h-4" /> Classic 2D entanglement view</span>
                  <span className="text-slate-500 font-mono">BELL_STATE / 2 QUBITS</span>
                </div>
                <div className="vr-orbit mx-auto" aria-label="Stylised visualization of two entangled qubits">
                  <div className="vr-ring ring-one" />
                  <div className="vr-ring ring-two" />
                  <div className="vr-core core-one"><span>q₀</span></div>
                  <div className="vr-core core-two"><span>q₁</span></div>
                  <div className="vr-link" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="xl:col-span-5 space-y-5">
          <div className="glass-card rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-300" />
              <h2 className="text-sm font-bold text-white">Measurement results</h2>
              <span className="ml-auto text-[10px] text-slate-500">shared with Lab</span>
            </div>
            <div className="space-y-3">
              {Object.entries(simulationResult.probabilities).map(([state, probability]) => (
                <div key={state}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-mono text-slate-300">|{state}⟩</span>
                    <span className="font-bold text-cyan-300">{probabilityLabel(probability)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all" style={{ width: `${Math.max(2, probability * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mt-4">The matching |00⟩ and |11⟩ peaks show correlation: measuring one qubit tells you the other qubit’s result.</p>
          </div>

          <div className="glass-card rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-cyan-300" />
              <h2 className="text-sm font-bold text-white">Inside the immersive lab</h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="flex gap-2"><Headset className="w-3.5 h-3.5 text-purple-300 flex-shrink-0 mt-0.5" /> Look around with the headset; the console, qubits and circuit wires surround you.</li>
              <li className="flex gap-2"><Hand className="w-3.5 h-3.5 text-cyan-300 flex-shrink-0 mt-0.5" /> Trigger-grab with controllers or pinch with tracked hands to pick up a gate.</li>
              <li className="flex gap-2"><Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 mt-0.5" /> Release a gate over a qubit to place it; CNOT links the other qubit automatically.</li>
              <li className="flex gap-2"><Play className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0 mt-0.5" /> Run, Measure, Reset and AI panels are reachable on the console in front of you.</li>
            </ul>
          </div>

          <div className="glass-card rounded-2xl border border-purple-500/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-purple-300" />
              <h2 className="text-sm font-bold text-white">AI Explain</h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {explanation?.body || 'Ask the tutor why these qubits stay correlated — the answer also appears on the panel inside VR.'}
            </p>
            <button type="button" onClick={explain} className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-bold hover:bg-purple-500/25">
              <Sparkles className="w-3.5 h-3.5" /> Explain this result
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRLab;
