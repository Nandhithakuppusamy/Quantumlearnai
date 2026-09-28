import React, { useEffect, useRef } from 'react';
import QuantumVRScene from '../vr/QuantumVRScene';

/**
 * Mounts the WebXR quantum lab. The scene is created once and then fed the
 * shared circuit/simulation state; handlers are read through a ref so the
 * render loop never rebinds stale callbacks.
 */
export const QuantumVRStage = ({
  circuit,
  result,
  explanation,
  status,
  onPlaceGate,
  onPlaceCnot,
  onAction,
  onSessionChange,
  onSceneReady
}) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const handlersRef = useRef({});
  handlersRef.current = { onPlaceGate, onPlaceCnot, onAction, onSessionChange };

  useEffect(() => {
    const scene = new QuantumVRScene(containerRef.current, {
      onPlaceGate: (...args) => handlersRef.current.onPlaceGate?.(...args),
      onPlaceCnot: (...args) => handlersRef.current.onPlaceCnot?.(...args),
      onAction: (...args) => handlersRef.current.onAction?.(...args),
      onSessionChange: (...args) => handlersRef.current.onSessionChange?.(...args)
    });
    sceneRef.current = scene;
    onSceneReady?.(scene);
    return () => {
      scene.dispose();
      sceneRef.current = null;
      onSceneReady?.(null);
    };
    // The scene is intentionally created once for the lifetime of the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sceneRef.current?.setCircuit(circuit);
  }, [circuit]);

  useEffect(() => {
    if (result) sceneRef.current?.setResult(result);
  }, [result]);

  useEffect(() => {
    if (explanation) sceneRef.current?.setExplanation(explanation);
  }, [explanation]);

  useEffect(() => {
    if (status) sceneRef.current?.setStatus(status);
  }, [status]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[52vh] min-h-[340px] rounded-3xl overflow-hidden border border-purple-500/30 bg-[#05070f]"
      aria-label="Interactive 3D quantum laboratory"
    />
  );
};

export default QuantumVRStage;
