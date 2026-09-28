import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ALGORITHM_PRESETS, simulateCircuit } from '../utils/quantumSimulator';

const STORAGE_KEY = 'quantumlearn_lab_state';

const DEFAULT_METRICS = {
  experiments: 12,
  circuitsModified: 7,
  whatIf: 3,
  vrExperiments: 2,
  algorithmsExplored: 4,
  conceptsMastered: 12
};

const readStoredState = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (stored?.circuit && Array.isArray(stored.circuit)) return stored;
  } catch {
    // Local storage is optional; use the educational defaults below.
  }
  return null;
};

const LabContext = createContext(null);

export const LabProvider = ({ children }) => {
  const stored = readStoredState();
  const initialAlgorithm = stored?.selectedAlgoKey && ALGORITHM_PRESETS[stored.selectedAlgoKey]
    ? stored.selectedAlgoKey
    : 'bell_state';
  const initialCircuit = stored?.circuit || ALGORITHM_PRESETS[initialAlgorithm].circuit;

  const [selectedAlgoKey, setSelectedAlgoKey] = useState(initialAlgorithm);
  const [circuit, setCircuit] = useState(initialCircuit);
  const [simulationResult, setSimulationResult] = useState(
    stored?.simulationResult || simulateCircuit(initialCircuit)
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [metrics, setMetrics] = useState({ ...DEFAULT_METRICS, ...(stored?.metrics || {}) });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        selectedAlgoKey,
        circuit,
        simulationResult,
        metrics
      }));
    } catch {
      // The lab remains fully functional when storage is unavailable.
    }
  }, [selectedAlgoKey, circuit, simulationResult, metrics]);

  const recordMetric = (metric) => {
    setMetrics((current) => ({
      ...current,
      [metric]: (current[metric] || 0) + 1
    }));
  };

  const value = useMemo(() => ({
    selectedAlgoKey,
    setSelectedAlgoKey,
    circuit,
    setCircuit,
    simulationResult,
    setSimulationResult,
    isSimulating,
    setIsSimulating,
    metrics,
    recordMetric
  }), [selectedAlgoKey, circuit, simulationResult, isSimulating, metrics]);

  return <LabContext.Provider value={value}>{children}</LabContext.Provider>;
};

export const useLab = () => {
  const context = useContext(LabContext);
  if (!context) throw new Error('useLab must be used within a LabProvider');
  return context;
};

export default LabContext;