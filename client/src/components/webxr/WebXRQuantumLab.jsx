import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'three/examples/jsm/webxr/XRHandModelFactory.js';
import toast from 'react-hot-toast';
import { simulateCircuit, ALGORITHM_PRESETS } from '../../utils/quantumSimulator';
import {
  playSimulateSound,
  playEntangleSound,
  playMeasureSound,
  playClickSound,
  speakAIText,
  stopSpeech
} from '../../utils/vrAudio';
import {
  createGateTexture,
  createButtonTexture,
  createMeasurementBoardTexture,
  createAITutorBoardTexture,
  createTextBadgeTexture
} from './vrTextures';

const GATE_PALETTE = ['H', 'X', 'Y', 'Z', 'CNOT', 'M', 'CLEAR'];
const NUM_SLOTS = 5;

// Helper to convert circuit steps into slot representations for 2 qubits
const circuitToSlots = (circuit = []) => {
  const q0Slots = Array(NUM_SLOTS).fill(null);
  const q1Slots = Array(NUM_SLOTS).fill(null);
  const cnotSlots = Array(NUM_SLOTS).fill(null); // { control: 0, target: 1 }

  circuit.slice(0, NUM_SLOTS).forEach((step, idx) => {
    if (step.type === 'cnot') {
      cnotSlots[idx] = { control: step.control, target: step.target };
    } else {
      if (step.q0) q0Slots[idx] = step.q0;
      if (step.q1) q1Slots[idx] = step.q1;
    }
  });

  return { q0Slots, q1Slots, cnotSlots };
};

// Helper to convert slot representations back into standard circuit steps
const slotsToCircuit = (q0Slots, q1Slots, cnotSlots) => {
  const steps = [];
  for (let i = 0; i < NUM_SLOTS; i++) {
    if (cnotSlots[i]) {
      steps.push({
        id: `step-${steps.length + 1}`,
        type: 'cnot',
        control: cnotSlots[i].control,
        target: cnotSlots[i].target
      });
    } else if (q0Slots[i] || q1Slots[i]) {
      steps.push({
        id: `step-${steps.length + 1}`,
        q0: q0Slots[i] || null,
        q1: q1Slots[i] || null
      });
    }
  }

  // Ensure default Bell state if empty
  if (steps.length === 0) {
    return [
      { id: 'step-1', q0: 'H', q1: null },
      { id: 'step-2', type: 'cnot', control: 0, target: 1 },
      { id: 'step-3', q0: 'M', q1: 'M' }
    ];
  }
  return steps;
};

export const WebXRQuantumLab = ({
  circuit,
  setCircuit,
  simulationResult,
  setSimulationResult,
  recordMetric,
  onSessionChange,
  triggerEnterVRRef
}) => {
  const containerRef = useRef(null);

  // Interaction State
  const [selectedGate, setSelectedGate] = useState('H');
  const [aiTopic, setAiTopic] = useState('bell');
  const [isSimulatingAnim, setIsSimulatingAnim] = useState(false);
  const [isMeasuringAnim, setIsMeasuringAnim] = useState(false);

  // References for VR loop
  const stateRef = useRef({
    circuit,
    simulationResult,
    selectedGate: 'H',
    aiTopic: 'bell',
    isSimulating: false,
    isMeasuring: false,
    q0Slots: Array(NUM_SLOTS).fill(null),
    q1Slots: Array(NUM_SLOTS).fill(null),
    cnotSlots: Array(NUM_SLOTS).fill(null)
  });

  // Keep stateRef in sync
  useEffect(() => {
    stateRef.current.circuit = circuit;
    stateRef.current.simulationResult = simulationResult;
    const { q0Slots, q1Slots, cnotSlots } = circuitToSlots(circuit);
    stateRef.current.q0Slots = q0Slots;
    stateRef.current.q1Slots = q1Slots;
    stateRef.current.cnotSlots = cnotSlots;
  }, [circuit, simulationResult]);

  useEffect(() => {
    stateRef.current.selectedGate = selectedGate;
  }, [selectedGate]);

  useEffect(() => {
    stateRef.current.aiTopic = aiTopic;
  }, [aiTopic]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer, scene, camera, controls;
    let controller1, controller2;
    let controllerGrip1, controllerGrip2;
    let hand1, hand2;
    let raycaster = new THREE.Raycaster();
    let tempMatrix = new THREE.Matrix4();
    let interactiveObjects = [];
    let animationFrameId;

    // References to dynamically updated 3D objects
    const dynamicMeshes = {
      gateModules: [],
      slotDocks: [],
      entanglementBridge: null,
      entanglementParticles: null,
      entangledBadge: null,
      measurementBoard: null,
      aiTutorBoard: null,
      qubit0Core: null,
      qubit1Core: null,
      qubit0Arrow: null,
      qubit1Arrow: null,
      qubit0Gimbal1: null,
      qubit0Gimbal2: null,
      qubit1Gimbal1: null,
      qubit1Gimbal2: null,
      superpositionAura0: null,
      superpositionAura1: null,
      simulationPulse: null,
      quantumDust: null
    };

    // 1. Scene, Camera, Renderer
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);
    scene.fog = new THREE.FogExp2(0x040817, 0.045);

    camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.1,
      60
    );
    camera.position.set(0, 1.45, 1.6);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    // Desktop Orbit Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.15, -1.2);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minDistance = 0.5;
    controls.maxDistance = 5.0;

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0x38bdf8, 3.5, 14, Math.PI / 4, 0.4, 1.2);
    mainSpot.position.set(0, 4.2, 0.5);
    mainSpot.target.position.set(0, 1.1, -1.3);
    scene.add(mainSpot);
    scene.add(mainSpot.target);

    const purpleSpot = new THREE.SpotLight(0xa855f7, 2.5, 12, Math.PI / 3, 0.5, 1.2);
    purpleSpot.position.set(2.5, 3.0, -1.0);
    scene.add(purpleSpot);

    const cyanPoint = new THREE.PointLight(0x06b6d4, 1.8, 6);
    cyanPoint.position.set(-1.8, 2.0, -1.2);
    scene.add(cyanPoint);

    // 3. Environment: Room-Scale Cyber Quantum Laboratory
    const buildEnvironment = () => {
      // Hex Grid Circular Platform under user
      const platformGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.12, 48);
      const platformMat = new THREE.MeshStandardMaterial({
        color: 0x080f24,
        roughness: 0.35,
        metalness: 0.8
      });
      const platform = new THREE.Mesh(platformGeo, platformMat);
      platform.position.y = -0.06;
      platform.receiveShadow = true;
      scene.add(platform);

      // Glowing Cyan Perimeter Ring
      const ringGeo = new THREE.TorusGeometry(3.62, 0.025, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.005;
      scene.add(ring);

      // Outer Grid Floor
      const grid = new THREE.GridHelper(32, 32, 0x06b6d4, 0x111c38);
      grid.position.y = -0.05;
      scene.add(grid);

      // Quantum Containment Mainframe Columns
      const columnPositions = [
        [-3.6, 0, -3.2],
        [3.6, 0, -3.2],
        [-4.2, 0, 1.8],
        [4.2, 0, 1.8]
      ];

      columnPositions.forEach(([x, y, z]) => {
        const colGeo = new THREE.BoxGeometry(0.55, 4.5, 0.55);
        const colMat = new THREE.MeshStandardMaterial({
          color: 0x0b1329,
          roughness: 0.3,
          metalness: 0.85
        });
        const col = new THREE.Mesh(colGeo, colMat);
        col.position.set(x, 2.25, z);
        scene.add(col);

        // Vertical glowing LED strip
        const ledGeo = new THREE.BoxGeometry(0.06, 4.2, 0.02);
        const ledMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(x, 2.25, z + 0.28);
        scene.add(led);
      });

      // Ceiling Quantum Ring Rig
      const ceilingRingGeo = new THREE.TorusGeometry(2.4, 0.04, 16, 64);
      const ceilingRingMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
      const ceilingRing = new THREE.Mesh(ceilingRingGeo, ceilingRingMat);
      ceilingRing.rotation.x = Math.PI / 2;
      ceilingRing.position.set(0, 3.8, -1.2);
      scene.add(ceilingRing);

      // Ambient Drifting Quantum Photons (Dust Particles)
      const dustCount = 250;
      const dustGeo = new THREE.BufferGeometry();
      const dustPos = new Float32Array(dustCount * 3);
      for (let i = 0; i < dustCount * 3; i += 3) {
        dustPos[i] = (Math.random() - 0.5) * 8;
        dustPos[i + 1] = Math.random() * 3.5;
        dustPos[i + 2] = (Math.random() - 0.5) * 8 - 1;
      }
      dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
      const dustMat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.028,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });
      dynamicMeshes.quantumDust = new THREE.Points(dustGeo, dustMat);
      scene.add(dynamicMeshes.quantumDust);
    };

    buildEnvironment();

    // 4. Centerpiece: Spatial Quantum Workbench Platform
    const benchGroup = new THREE.Group();
    benchGroup.position.set(0, 1.05, -1.4);

    // Workbench Table Body
    const tableTopGeo = new THREE.BoxGeometry(2.8, 0.08, 0.9);
    const tableTopMat = new THREE.MeshStandardMaterial({
      color: 0x091026,
      roughness: 0.25,
      metalness: 0.9
    });
    const tableTop = new THREE.Mesh(tableTopGeo, tableTopMat);
    tableTop.receiveShadow = true;
    benchGroup.add(tableTop);

    // Glowing Neon Rim around Table
    const tableRimGeo = new THREE.BoxGeometry(2.84, 0.015, 0.94);
    const tableRimMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const tableRim = new THREE.Mesh(tableRimGeo, tableRimMat);
    tableRim.position.y = 0.04;
    benchGroup.add(tableRim);

    // Workbench Pedestal Base
    const pedestalGeo = new THREE.CylinderGeometry(0.35, 0.5, 1.0, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x070c1d,
      roughness: 0.4,
      metalness: 0.8
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.54;
    benchGroup.add(pedestal);

    scene.add(benchGroup);

    // 5. Quantum Circuit Waveguide Rails (Qubit 0 and Qubit 1)
    const circuitGroup = new THREE.Group();
    circuitGroup.position.set(0, 1.15, -1.4);

    const q0RailY = 0.14;
    const q1RailY = -0.14;
    const railLength = 2.0;

    // Superconducting Rails
    [q0RailY, q1RailY].forEach((yPos, idx) => {
      const railGeo = new THREE.CylinderGeometry(0.012, 0.012, railLength, 16);
      const railMat = new THREE.MeshStandardMaterial({
        color: idx === 0 ? 0x06b6d4 : 0xa855f7,
        emissive: idx === 0 ? 0x083344 : 0x3b0764,
        roughness: 0.2,
        metalness: 0.9
      });
      const rail = new THREE.Mesh(railGeo, railMat);
      rail.rotation.z = Math.PI / 2;
      rail.position.set(0, yPos, 0);
      circuitGroup.add(rail);

      // Qubit Source Origin Badge (Left side)
      const badgeTexture = createTextBadgeTexture({
        text: `|q${idx}⟩`,
        subtext: '|0⟩ Initial',
        borderColor: idx === 0 ? '#06b6d4' : '#a855f7',
        textColor: idx === 0 ? '#38bdf8' : '#c084fc',
        width: 256,
        height: 128
      });
      const badgeMat = new THREE.MeshBasicMaterial({
        map: badgeTexture,
        transparent: true
      });
      const badge = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.12), badgeMat);
      badge.position.set(-1.18, yPos, 0.02);
      circuitGroup.add(badge);
    });

    // Circuit Step Slot Docks (5 positions along X)
    const slotXPositions = [-0.68, -0.34, 0.0, 0.34, 0.68];
    const slotDocks = [];

    slotXPositions.forEach((xPos, slotIdx) => {
      // Qubit 0 Slot
      const dock0Geo = new THREE.CylinderGeometry(0.07, 0.07, 0.015, 24);
      const dock0Mat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: 0x0e7490,
        emissiveIntensity: 0.4,
        roughness: 0.4
      });
      const dock0 = new THREE.Mesh(dock0Geo, dock0Mat);
      dock0.rotation.x = Math.PI / 2;
      dock0.position.set(xPos, q0RailY, 0.02);
      dock0.userData = { type: 'slot', qubit: 0, slotIdx };
      circuitGroup.add(dock0);
      slotDocks.push(dock0);
      interactiveObjects.push(dock0);

      // Qubit 1 Slot
      const dock1Geo = new THREE.CylinderGeometry(0.07, 0.07, 0.015, 24);
      const dock1Mat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: 0x6b21a8,
        emissiveIntensity: 0.4,
        roughness: 0.4
      });
      const dock1 = new THREE.Mesh(dock1Geo, dock1Mat);
      dock1.rotation.x = Math.PI / 2;
      dock1.position.set(xPos, q1RailY, 0.02);
      dock1.userData = { type: 'slot', qubit: 1, slotIdx };
      circuitGroup.add(dock1);
      slotDocks.push(dock1);
      interactiveObjects.push(dock1);

      // Slot Number Tag underneath
      const numBadgeTexture = createTextBadgeTexture({
        text: `S${slotIdx + 1}`,
        bgColor: '#020617',
        borderColor: '#334155',
        textColor: '#64748b',
        width: 128,
        height: 64
      });
      const numBadge = new THREE.Mesh(
        new THREE.PlaneGeometry(0.1, 0.05),
        new THREE.MeshBasicMaterial({ map: numBadgeTexture, transparent: true })
      );
      numBadge.position.set(xPos, -0.26, 0.02);
      circuitGroup.add(numBadge);
    });

    dynamicMeshes.slotDocks = slotDocks;

    // Simulation Pulse Wave effect along rails
    const pulseGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 16);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending
    });
    const simulationPulse = new THREE.Mesh(pulseGeo, pulseMat);
    simulationPulse.rotation.x = Math.PI / 2;
    circuitGroup.add(simulationPulse);
    dynamicMeshes.simulationPulse = simulationPulse;

    scene.add(circuitGroup);

    // 6. 3D Qubit Visualizers (Bloch Cores at the output end)
    const buildQubitCore = (qubitIdx, yPos) => {
      const coreGroup = new THREE.Group();
      coreGroup.position.set(1.22, yPos, 0);

      // Gimbal Outer Ring 1
      const ring1Geo = new THREE.TorusGeometry(0.12, 0.007, 12, 48);
      const ring1Mat = new THREE.MeshStandardMaterial({
        color: qubitIdx === 0 ? 0x06b6d4 : 0xa855f7,
        metalness: 0.9,
        roughness: 0.2
      });
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      coreGroup.add(ring1);

      // Gimbal Inner Ring 2
      const ring2Geo = new THREE.TorusGeometry(0.095, 0.006, 12, 48);
      const ring2Mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.8,
        roughness: 0.3
      });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = Math.PI / 2;
      coreGroup.add(ring2);

      // Glowing Inner Energy Sphere
      const sphereGeo = new THREE.SphereGeometry(0.065, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: qubitIdx === 0 ? 0x06b6d4 : 0xa855f7,
        emissive: qubitIdx === 0 ? 0x0891b2 : 0x9333ea,
        emissiveIntensity: 0.8,
        roughness: 0.15,
        metalness: 0.3
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      coreGroup.add(sphere);

      // 3D Bloch Vector Arrow (Pointer from center to sphere surface)
      const arrowDir = new THREE.Vector3(0, 1, 0);
      const arrowOrigin = new THREE.Vector3(0, 0, 0);
      const arrow = new THREE.ArrowHelper(
        arrowDir,
        arrowOrigin,
        0.11,
        qubitIdx === 0 ? 0x38bdf8 : 0xd8b4fe,
        0.035,
        0.02
      );
      coreGroup.add(arrow);

      // Pulsing Superposition Particle Aura
      const auraGeo = new THREE.SphereGeometry(0.13, 24, 24);
      const auraMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending
      });
      const aura = new THREE.Mesh(auraGeo, auraMat);
      coreGroup.add(aura);

      // Qubit State Label above core
      const labelTexture = createTextBadgeTexture({
        text: `q${qubitIdx} Core`,
        subtext: 'Output State',
        borderColor: qubitIdx === 0 ? '#06b6d4' : '#a855f7',
        textColor: '#ffffff',
        width: 256,
        height: 128
      });
      const label = new THREE.Mesh(
        new THREE.PlaneGeometry(0.18, 0.09),
        new THREE.MeshBasicMaterial({ map: labelTexture, transparent: true })
      );
      label.position.set(0, 0.16, 0);
      coreGroup.add(label);

      circuitGroup.add(coreGroup);

      if (qubitIdx === 0) {
        dynamicMeshes.qubit0Core = sphere;
        dynamicMeshes.qubit0Arrow = arrow;
        dynamicMeshes.qubit0Gimbal1 = ring1;
        dynamicMeshes.qubit0Gimbal2 = ring2;
        dynamicMeshes.superpositionAura0 = aura;
      } else {
        dynamicMeshes.qubit1Core = sphere;
        dynamicMeshes.qubit1Arrow = arrow;
        dynamicMeshes.qubit1Gimbal1 = ring1;
        dynamicMeshes.qubit1Gimbal2 = ring2;
        dynamicMeshes.superpositionAura1 = aura;
      }
    };

    buildQubitCore(0, q0RailY);
    buildQubitCore(1, q1RailY);

    // 7. Entanglement Bridge: Primary Bell State Visualization!
    // Connects Qubit 0 Core and Qubit 1 Core when CNOT entangles them
    const bridgeCurve = new THREE.LineCurve3(
      new THREE.Vector3(1.22, q0RailY, 0),
      new THREE.Vector3(1.22, q1RailY, 0)
    );
    const bridgeGeo = new THREE.TubeGeometry(bridgeCurve, 20, 0.02, 12, false);
    const bridgeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x8b5cf6,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.0,
      roughness: 0.1,
      metalness: 0.5
    });
    const entanglementBridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    circuitGroup.add(entanglementBridge);
    dynamicMeshes.entanglementBridge = entanglementBridge;

    // Entanglement Swirling Particles
    const entCount = 60;
    const entGeo = new THREE.BufferGeometry();
    const entPositions = new Float32Array(entCount * 3);
    for (let i = 0; i < entCount; i++) {
      const t = i / entCount;
      const angle = t * Math.PI * 6;
      entPositions[i * 3] = 1.22 + Math.cos(angle) * 0.045;
      entPositions[i * 3 + 1] = q0RailY + (q1RailY - q0RailY) * t;
      entPositions[i * 3 + 2] = Math.sin(angle) * 0.045;
    }
    entGeo.setAttribute('position', new THREE.BufferAttribute(entPositions, 3));
    const entMat = new THREE.PointsMaterial({
      color: 0xd8b4fe,
      size: 0.022,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending
    });
    const entanglementParticles = new THREE.Points(entGeo, entMat);
    circuitGroup.add(entanglementParticles);
    dynamicMeshes.entanglementParticles = entanglementParticles;

    // Entangled Bell Pair 3D Floating Badge
    const badgeTexture = createTextBadgeTexture({
      text: '★ BELL ENTANGLED PAIR (|Φ⁺⟩)',
      subtext: 'q₀ and q₁ are maximally entangled: (|00⟩ + |11⟩)/√2',
      bgColor: '#170b2c',
      borderColor: '#a855f7',
      textColor: '#f0abfc',
      subtextColor: '#c084fc',
      width: 768,
      height: 192
    });
    const entBadge = new THREE.Mesh(
      new THREE.PlaneGeometry(0.72, 0.18),
      new THREE.MeshBasicMaterial({ map: badgeTexture, transparent: true })
    );
    entBadge.position.set(0, 0.36, 0.02);
    entBadge.visible = false;
    circuitGroup.add(entBadge);
    dynamicMeshes.entangledBadge = entBadge;

    // 8. 3D Gate Palette / Dispenser (Floating to the Left)
    const paletteGroup = new THREE.Group();
    paletteGroup.position.set(-1.6, 1.25, -1.35);
    paletteGroup.rotation.y = Math.PI / 6; // Angled 30 deg toward student

    // Palette Backing Board
    const paletteBackGeo = new THREE.BoxGeometry(0.38, 1.05, 0.03);
    const paletteBackMat = new THREE.MeshStandardMaterial({
      color: 0x091026,
      roughness: 0.3,
      metalness: 0.85
    });
    const paletteBack = new THREE.Mesh(paletteBackGeo, paletteBackMat);
    paletteGroup.add(paletteBack);

    // Palette Title Tag
    const palTitleTexture = createTextBadgeTexture({
      text: 'GATE DISPENSER',
      subtext: 'Pick Gate → Click Slot',
      bgColor: '#0f172a',
      borderColor: '#06b6d4',
      textColor: '#38bdf8',
      width: 384,
      height: 128
    });
    const palTitle = new THREE.Mesh(
      new THREE.PlaneGeometry(0.32, 0.11),
      new THREE.MeshBasicMaterial({ map: palTitleTexture, transparent: true })
    );
    palTitle.position.set(0, 0.44, 0.02);
    paletteGroup.add(palTitle);

    // Gate Item Cubes in Palette
    const gateColors = {
      H: '#06b6d4',
      X: '#8b5cf6',
      Y: '#10b981',
      Z: '#f59e0b',
      CNOT: '#6366f1',
      M: '#f59e0b',
      CLEAR: '#ef4444'
    };

    GATE_PALETTE.forEach((gate, gIdx) => {
      const yOffset = 0.32 - gIdx * 0.11;
      const gTex = createGateTexture(gate, gateColors[gate]);
      const gMat = new THREE.MeshStandardMaterial({
        map: gTex,
        roughness: 0.2,
        metalness: 0.4,
        emissive: new THREE.Color(gateColors[gate]),
        emissiveIntensity: 0.25
      });
      const gMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.04), gMat);
      gMesh.position.set(0, yOffset, 0.03);
      gMesh.userData = { type: 'palette_gate', gate };
      paletteGroup.add(gMesh);
      interactiveObjects.push(gMesh);
    });

    scene.add(paletteGroup);

    // 9. 3D VR Control Deck (Floating Buttons below Workbench)
    const controlDeckGroup = new THREE.Group();
    controlDeckGroup.position.set(0, 0.72, -1.15);
    controlDeckGroup.rotation.x = -Math.PI / 5; // Tilted up 36 deg for comfortable reach

    const buttonsConfig = [
      { id: 'run', text: 'RUN CIRCUIT', icon: '▶', borderColor: '#06b6d4', x: -0.54 },
      { id: 'measure', text: 'MEASURE', icon: '⚡', borderColor: '#f59e0b', x: -0.18 },
      { id: 'reset_bell', text: 'RESET BELL', icon: '🔄', borderColor: '#3b82f6', x: 0.18 },
      { id: 'ai_tutor', text: 'AI TUTOR', icon: '🤖', borderColor: '#a855f7', x: 0.54 }
    ];

    buttonsConfig.forEach(({ id, text, icon, borderColor, x }) => {
      const btnTex = createButtonTexture({ text, icon, borderColor });
      const btnMat = new THREE.MeshStandardMaterial({
        map: btnTex,
        roughness: 0.3,
        metalness: 0.5,
        emissive: new THREE.Color(borderColor),
        emissiveIntensity: 0.3
      });
      const btnMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.1, 0.03), btnMat);
      btnMesh.position.set(x, 0, 0);
      btnMesh.userData = { type: 'control_btn', action: id };
      controlDeckGroup.add(btnMesh);
      interactiveObjects.push(btnMesh);
    });

    scene.add(controlDeckGroup);

    // 10. In-VR 3D Holographic Measurement Display (Floating to the Right)
    const measureGroup = new THREE.Group();
    measureGroup.position.set(1.7, 1.35, -1.35);
    measureGroup.rotation.y = -Math.PI / 5; // Angled 36 deg toward student

    const initialBoardTex = createMeasurementBoardTexture(
      stateRef.current.simulationResult?.probabilities,
      stateRef.current.simulationResult?.shotCounts
    );
    const measureBoardMat = new THREE.MeshBasicMaterial({
      map: initialBoardTex,
      transparent: true,
      side: THREE.DoubleSide
    });
    const measureBoard = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.75), measureBoardMat);
    measureGroup.add(measureBoard);
    dynamicMeshes.measurementBoard = measureBoard;

    scene.add(measureGroup);

    // 11. In-VR 3D Holographic AI Tutor Panel (Floating Upper-Left)
    const aiGroup = new THREE.Group();
    aiGroup.position.set(-1.65, 1.85, -1.35);
    aiGroup.rotation.y = Math.PI / 5;

    const initialAiTex = createAITutorBoardTexture({
      topicTitle: 'Bell State (|Φ⁺⟩) Demonstration',
      explanation: 'Hadamard creates superposition (|0⟩+|1⟩)/√2 on q₀. CNOT entangles q₀ and q₁ into (|00⟩+|11⟩)/√2.',
      keyPoints: [
        'H gate on q₀ creates 50/50 superposition',
        'CNOT entangles q₀ and q₁ into a Bell State',
        'Measurement collapses them strictly into |00⟩ (50%) or |11⟩ (50%)'
      ]
    });
    const aiBoardMat = new THREE.MeshBasicMaterial({
      map: initialAiTex,
      transparent: true,
      side: THREE.DoubleSide
    });
    const aiBoard = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.78), aiBoardMat);
    aiGroup.add(aiBoard);
    dynamicMeshes.aiTutorBoard = aiBoard;

    // AI Interactive Topic Sub-Buttons below the AI Board
    const aiTopicButtons = [
      { id: 'bell', text: 'Bell State', x: -0.36 },
      { id: 'entanglement', text: 'Entanglement', x: -0.12 },
      { id: 'superposition', text: 'Superposition', x: 0.12 },
      { id: 'voice', text: '🔊 Speak Aloud', x: 0.36 }
    ];

    aiTopicButtons.forEach(({ id, text, x }) => {
      const tex = createButtonTexture({
        text,
        bgColor: '#1e1b4b',
        borderColor: '#a855f7',
        textColor: '#e0e7ff',
        width: 256,
        height: 80
      });
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        emissive: 0x4c1d95,
        emissiveIntensity: 0.3,
        roughness: 0.3
      });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.065, 0.02), mat);
      mesh.position.set(x, -0.46, 0.01);
      mesh.userData = { type: 'ai_topic_btn', topic: id };
      aiGroup.add(mesh);
      interactiveObjects.push(mesh);
    });

    scene.add(aiGroup);

    // 12. Function to Update the 3D Circuit Gate Meshes based on Slots
    const updateCircuitMeshes = () => {
      // Remove old gate modules from circuitGroup
      dynamicMeshes.gateModules.forEach((m) => {
        circuitGroup.remove(m);
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material.dispose();
        }
      });
      dynamicMeshes.gateModules = [];

      // Re-populate interactive list (keep palette, control buttons, slots, ai buttons)
      interactiveObjects = interactiveObjects.filter((obj) => obj.userData.type !== 'circuit_gate');

      const { q0Slots, q1Slots, cnotSlots } = stateRef.current;

      slotXPositions.forEach((xPos, sIdx) => {
        // CNOT Gate
        if (cnotSlots[sIdx]) {
          const cnotGroup = new THREE.Group();
          cnotGroup.position.set(xPos, 0, 0);

          // Control Sphere on q0
          const controlGeo = new THREE.SphereGeometry(0.04, 24, 24);
          const controlMat = new THREE.MeshStandardMaterial({
            color: 0x06b6d4,
            emissive: 0x0891b2,
            emissiveIntensity: 0.8,
            roughness: 0.2
          });
          const controlMesh = new THREE.Mesh(controlGeo, controlMat);
          controlMesh.position.y = q0RailY;
          cnotGroup.add(controlMesh);

          // Vertical Quantum Entanglement Line
          const lineGeo = new THREE.CylinderGeometry(0.01, 0.01, Math.abs(q0RailY - q1RailY), 16);
          const lineMat = new THREE.MeshBasicMaterial({ color: 0x818cf8 });
          const lineMesh = new THREE.Mesh(lineGeo, lineMat);
          lineMesh.position.y = (q0RailY + q1RailY) / 2;
          cnotGroup.add(lineMesh);

          // Target ⊕ Ring on q1
          const targetRingGeo = new THREE.TorusGeometry(0.045, 0.008, 12, 32);
          const targetRingMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6 });
          const targetRing = new THREE.Mesh(targetRingGeo, targetRingMat);
          targetRing.position.y = q1RailY;
          cnotGroup.add(targetRing);

          // Cross inside Target Ring
          const crossH = new THREE.Mesh(
            new THREE.BoxGeometry(0.07, 0.006, 0.006),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
          );
          crossH.position.y = q1RailY;
          cnotGroup.add(crossH);

          const crossV = new THREE.Mesh(
            new THREE.BoxGeometry(0.006, 0.07, 0.006),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
          );
          crossV.position.y = q1RailY;
          cnotGroup.add(crossV);

          cnotGroup.userData = { type: 'circuit_gate', gate: 'CNOT', slotIdx: sIdx };
          circuitGroup.add(cnotGroup);
          dynamicMeshes.gateModules.push(cnotGroup);
          interactiveObjects.push(cnotGroup);
          return;
        }

        // Qubit 0 Gate
        const q0Gate = q0Slots[sIdx];
        if (q0Gate) {
          const gTex = createGateTexture(q0Gate, gateColors[q0Gate] || '#06b6d4');
          const gMat = new THREE.MeshStandardMaterial({
            map: gTex,
            roughness: 0.2,
            metalness: 0.4,
            emissive: new THREE.Color(gateColors[q0Gate] || '#06b6d4'),
            emissiveIntensity: 0.35
          });
          const gMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.05), gMat);
          gMesh.position.set(xPos, q0RailY, 0.04);
          gMesh.userData = { type: 'circuit_gate', qubit: 0, slotIdx: sIdx, gate: q0Gate };
          circuitGroup.add(gMesh);
          dynamicMeshes.gateModules.push(gMesh);
          interactiveObjects.push(gMesh);
        }

        // Qubit 1 Gate
        const q1Gate = q1Slots[sIdx];
        if (q1Gate) {
          const gTex = createGateTexture(q1Gate, gateColors[q1Gate] || '#a855f7');
          const gMat = new THREE.MeshStandardMaterial({
            map: gTex,
            roughness: 0.2,
            metalness: 0.4,
            emissive: new THREE.Color(gateColors[q1Gate] || '#a855f7'),
            emissiveIntensity: 0.35
          });
          const gMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.05), gMat);
          gMesh.position.set(xPos, q1RailY, 0.04);
          gMesh.userData = { type: 'circuit_gate', qubit: 1, slotIdx: sIdx, gate: q1Gate };
          circuitGroup.add(gMesh);
          dynamicMeshes.gateModules.push(gMesh);
          interactiveObjects.push(gMesh);
        }
      });

      // Update Visual State Dynamics (Superposition, Bloch arrows, Entanglement)
      updateQuantumVisualDynamics();
    };

    // 13. Update Visual Animations (Superposition, Bloch Coordinates, Entanglement Bridge)
    const updateQuantumVisualDynamics = () => {
      const sim = stateRef.current.simulationResult;
      const { cnotSlots, q0Slots } = stateRef.current;
      const hasCNOT = cnotSlots.some((c) => c !== null);
      const hasHadamard = q0Slots.some((g) => g === 'H');

      // Check if current circuit produces Bell State entanglement
      const isEntangled = sim?.bloch?.q0?.isEntangled || (hasCNOT && hasHadamard);

      // Entanglement Bridge & Badge visibility
      if (dynamicMeshes.entanglementBridge) {
        dynamicMeshes.entanglementBridge.material.opacity = isEntangled ? 0.9 : 0.0;
      }
      if (dynamicMeshes.entanglementParticles) {
        dynamicMeshes.entanglementParticles.material.opacity = isEntangled ? 0.85 : 0.0;
      }
      if (dynamicMeshes.entangledBadge) {
        dynamicMeshes.entangledBadge.visible = isEntangled;
      }

      // Superposition Auras on Qubit Cores
      if (dynamicMeshes.superpositionAura0) {
        dynamicMeshes.superpositionAura0.material.opacity = hasHadamard ? 0.75 : 0.0;
      }

      // Orient Bloch Vector Arrows from calculated simulator coordinates
      if (sim?.bloch?.q0 && dynamicMeshes.qubit0Arrow) {
        const b0 = sim.bloch.q0;
        // Direction vector from bloch coordinates
        const dir0 = new THREE.Vector3(b0.x, b0.z, b0.y).normalize();
        if (dir0.lengthSq() > 0.01) {
          dynamicMeshes.qubit0Arrow.setDirection(dir0);
        }
      }
      if (sim?.bloch?.q1 && dynamicMeshes.qubit1Arrow) {
        const b1 = sim.bloch.q1;
        const dir1 = new THREE.Vector3(b1.x, b1.z, b1.y).normalize();
        if (dir1.lengthSq() > 0.01) {
          dynamicMeshes.qubit1Arrow.setDirection(dir1);
        }
      }

      // Update Measurement Board Texture
      if (dynamicMeshes.measurementBoard && sim?.probabilities) {
        const newTex = createMeasurementBoardTexture(sim.probabilities, sim.shotCounts);
        dynamicMeshes.measurementBoard.material.map = newTex;
        dynamicMeshes.measurementBoard.material.needsUpdate = true;
      }
    };

    // Initial Circuit Meshes build
    updateCircuitMeshes();

    // 14. Action Handlers (Run Circuit, Measure, Reset Bell, AI Topics)
    const handleRunCircuit = () => {
      playSimulateSound();
      stateRef.current.isSimulating = true;
      setIsSimulatingAnim(true);

      // Animate wave pulse from left to right
      if (dynamicMeshes.simulationPulse) {
        dynamicMeshes.simulationPulse.material.opacity = 0.9;
        dynamicMeshes.simulationPulse.position.x = -1.0;
      }

      setTimeout(() => {
        const newResult = simulateCircuit(stateRef.current.circuit);
        stateRef.current.simulationResult = newResult;
        stateRef.current.isSimulating = false;
        setIsSimulatingAnim(false);

        setSimulationResult(newResult);
        recordMetric('experiments');
        recordMetric('vrExperiments');

        if (dynamicMeshes.simulationPulse) {
          dynamicMeshes.simulationPulse.material.opacity = 0.0;
        }

        updateQuantumVisualDynamics();

        // Check for Bell State formation and play chord
        const isBell = newResult.probabilities['00'] > 0.4 && newResult.probabilities['11'] > 0.4;
        if (isBell) {
          playEntangleSound();
          toast.success('Bell Entangled State (|Φ⁺⟩) Achieved!');
        } else {
          toast.success('Quantum Simulation Complete');
        }
      }, 400);
    };

    const handleMeasure = () => {
      playMeasureSound();
      stateRef.current.isMeasuring = true;
      setIsMeasuringAnim(true);

      // Flash qubit cores to simulate wave function collapse
      if (dynamicMeshes.qubit0Core) dynamicMeshes.qubit0Core.material.emissiveIntensity = 2.5;
      if (dynamicMeshes.qubit1Core) dynamicMeshes.qubit1Core.material.emissiveIntensity = 2.5;

      setTimeout(() => {
        if (dynamicMeshes.qubit0Core) dynamicMeshes.qubit0Core.material.emissiveIntensity = 0.8;
        if (dynamicMeshes.qubit1Core) dynamicMeshes.qubit1Core.material.emissiveIntensity = 0.8;

        const newResult = simulateCircuit(stateRef.current.circuit);
        stateRef.current.simulationResult = newResult;
        stateRef.current.isMeasuring = false;
        setIsMeasuringAnim(false);

        setSimulationResult(newResult);
        recordMetric('experiments');

        updateQuantumVisualDynamics();
        toast('Qubits Measured: Wavefunction Collapsed', { icon: '⚡' });
      }, 300);
    };

    const handleResetBell = () => {
      playClickSound(520);
      const bellCircuit = [
        { id: 'step-1', q0: 'H', q1: null },
        { id: 'step-2', type: 'cnot', control: 0, target: 1 },
        { id: 'step-3', q0: 'M', q1: 'M' }
      ];
      setCircuit(bellCircuit);
      const newResult = simulateCircuit(bellCircuit);
      setSimulationResult(newResult);

      const { q0Slots, q1Slots, cnotSlots } = circuitToSlots(bellCircuit);
      stateRef.current.circuit = bellCircuit;
      stateRef.current.simulationResult = newResult;
      stateRef.current.q0Slots = q0Slots;
      stateRef.current.q1Slots = q1Slots;
      stateRef.current.cnotSlots = cnotSlots;

      updateCircuitMeshes();
      playEntangleSound();
      toast.success('Reset to Bell State (|Φ⁺⟩)');
    };

    const handleAITopic = (topic) => {
      playClickSound(640);
      setAiTopic(topic);
      stateRef.current.aiTopic = topic;

      let topicTitle = 'Bell State (|Φ⁺⟩)';
      let explanation = 'Hadamard creates superposition on q₀. CNOT entangles q₀ and q₁.';
      let keyPoints = [
        'H gate on q₀ creates 50/50 superposition',
        'CNOT entangles both qubits into a Bell State',
        'Measurement collapses them strictly into |00⟩ (50%) or |11⟩ (50%)'
      ];
      let narration = '';

      if (topic === 'bell') {
        narration = 'In the Bell State demonstration, Qubit 0 is first put into an even superposition using a Hadamard gate. Next, a Controlled-NOT gate links Qubit 0 with Qubit 1. This creates maximal quantum entanglement.';
      } else if (topic === 'entanglement') {
        topicTitle = 'Quantum Entanglement';
        explanation = 'Entanglement is a non-local quantum phenomenon where particles become interconnected such that one particle cannot be described independently of the other.';
        keyPoints = [
          'Einstein termed entanglement "spooky action at a distance"',
          'Measuring qubit 0 instantaneously dictates qubit 1 without speed-of-light delay',
          'Enables quantum teleportation and superdense coding'
        ];
        narration = 'Quantum entanglement connects two qubits into a single composite quantum system. Regardless of the distance separating them, measuring one immediately determines the other.';
      } else if (topic === 'superposition') {
        topicTitle = 'Quantum Superposition';
        explanation = 'Superposition allows a qubit to exist in a linear combination of states |0⟩ and |1⟩ simultaneously until physical measurement occurs.';
        keyPoints = [
          'Calculated as |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1',
          'Created using Hadamard (H) or rotation gates',
          'Provides quantum parallelism to evaluate multiple states at once'
        ];
        narration = 'Quantum superposition allows a qubit to hold a blend of both zero and one states simultaneously. This foundational principle grants quantum computers exponential computational potential.';
      } else if (topic === 'voice') {
        narration = 'Welcome to the VR Quantum Lab. You are observing a Bell State. The Hadamard gate on Qubit 0 creates an even superposition. The CNOT gate entangles both qubits. When measured, they yield identical correlated results fifty percent of the time.';
      }

      if (dynamicMeshes.aiTutorBoard) {
        const tex = createAITutorBoardTexture({ topicTitle, explanation, keyPoints });
        dynamicMeshes.aiTutorBoard.material.map = tex;
        dynamicMeshes.aiTutorBoard.material.needsUpdate = true;
      }

      if (narration) {
        speakAIText(narration);
      }
    };

    // 15. Slot Placement & Interaction Router
    const handleInteractWithObject = (obj) => {
      const data = obj.userData;
      if (!data) return;

      // 1. Clicked a Gate on the Palette
      if (data.type === 'palette_gate') {
        playClickSound(480);
        setSelectedGate(data.gate);
        stateRef.current.selectedGate = data.gate;
        toast(`Selected ${data.gate} Gate`, { icon: '📦' });
        return;
      }

      // 2. Clicked a Circuit Slot Dock
      if (data.type === 'slot') {
        const { qubit, slotIdx } = data;
        const gateToPlace = stateRef.current.selectedGate;
        const { q0Slots, q1Slots, cnotSlots } = stateRef.current;

        playClickSound(580);

        if (gateToPlace === 'CLEAR') {
          q0Slots[slotIdx] = null;
          q1Slots[slotIdx] = null;
          cnotSlots[slotIdx] = null;
        } else if (gateToPlace === 'CNOT') {
          // Place CNOT between q0 and q1 at this slot
          cnotSlots[slotIdx] = { control: 0, target: 1 };
          q0Slots[slotIdx] = null;
          q1Slots[slotIdx] = null;
        } else {
          cnotSlots[slotIdx] = null;
          if (qubit === 0) q0Slots[slotIdx] = gateToPlace;
          else q1Slots[slotIdx] = gateToPlace;
        }

        const newCircuit = slotsToCircuit(q0Slots, q1Slots, cnotSlots);
        stateRef.current.circuit = newCircuit;
        setCircuit(newCircuit);
        recordMetric('circuitsModified');

        // Re-simulate circuit automatically to keep shared state active
        const newResult = simulateCircuit(newCircuit);
        stateRef.current.simulationResult = newResult;
        setSimulationResult(newResult);

        updateCircuitMeshes();
        toast.success(`Updated Circuit: Slot ${slotIdx + 1}`);
        return;
      }

      // 3. Clicked an existing gate in the circuit
      if (data.type === 'circuit_gate') {
        const { slotIdx } = data;
        const { q0Slots, q1Slots, cnotSlots } = stateRef.current;
        playClickSound(360);

        // Remove that gate
        q0Slots[slotIdx] = null;
        q1Slots[slotIdx] = null;
        cnotSlots[slotIdx] = null;

        const newCircuit = slotsToCircuit(q0Slots, q1Slots, cnotSlots);
        stateRef.current.circuit = newCircuit;
        setCircuit(newCircuit);
        recordMetric('circuitsModified');

        const newResult = simulateCircuit(newCircuit);
        stateRef.current.simulationResult = newResult;
        setSimulationResult(newResult);

        updateCircuitMeshes();
        toast('Gate removed from circuit', { icon: '🗑' });
        return;
      }

      // 4. Clicked Control Button
      if (data.type === 'control_btn') {
        if (data.action === 'run') handleRunCircuit();
        else if (data.action === 'measure') handleMeasure();
        else if (data.action === 'reset_bell') handleResetBell();
        else if (data.action === 'ai_tutor') handleAITopic('bell');
        return;
      }

      // 5. Clicked AI Topic Button
      if (data.type === 'ai_topic_btn') {
        handleAITopic(data.topic);
        return;
      }
    };

    // 16. WebXR VR Controllers & Hand Tracking Setup
    const buildControllerLaser = () => {
      const laserGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -3.5)
      ]);
      const laserMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });
      const line = new THREE.Line(laserGeo, laserMat);

      // Pointer tip reticle sphere
      const reticleGeo = new THREE.SphereGeometry(0.018, 16, 16);
      const reticleMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const reticle = new THREE.Mesh(reticleGeo, reticleMat);
      reticle.position.z = -3.5;
      line.add(reticle);

      return line;
    };

    // Controller 0 (Right) & Controller 1 (Left)
    controller1 = renderer.xr.getController(0);
    controller1.add(buildControllerLaser());
    scene.add(controller1);

    controller2 = renderer.xr.getController(1);
    controller2.add(buildControllerLaser());
    scene.add(controller2);

    // Controller Grips & Models
    const controllerModelFactory = new XRControllerModelFactory();
    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);

    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);

    // Hand Tracking Models (Quest / Vision Pro)
    const handModelFactory = new XRHandModelFactory();
    hand1 = renderer.xr.getHand(0);
    hand1.add(handModelFactory.createHandModel(hand1, 'mesh'));
    scene.add(hand1);

    hand2 = renderer.xr.getHand(1);
    hand2.add(handModelFactory.createHandModel(hand2, 'mesh'));
    scene.add(hand2);

    // VR Controller Selection Listener
    const onSelectStart = (event) => {
      const controller = event.target;
      tempMatrix.identity().extractRotation(controller.matrixWorld);
      raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

      const intersects = raycaster.intersectObjects(interactiveObjects, true);
      if (intersects.length > 0) {
        // Find top interactive ancestor
        let hit = intersects[0].object;
        while (hit && !hit.userData?.type && hit.parent !== scene) {
          hit = hit.parent;
        }
        if (hit && hit.userData?.type) {
          // Provide VR controller haptic pulse if available
          const session = renderer.xr.getSession();
          if (session && event.data?.gamepad?.hapticActuators?.length) {
            event.data.gamepad.hapticActuators[0].pulse(0.65, 45);
          }
          handleInteractWithObject(hit);
        }
      }
    };

    controller1.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectstart', onSelectStart);

    // 17. Desktop Mouse Click Handler (Desktop 3D Fallback)
    const onCanvasClick = (event) => {
      if (renderer.xr.isPresenting) return; // Ignore mouse when in headset

      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        let hit = intersects[0].object;
        while (hit && !hit.userData?.type && hit.parent !== scene) {
          hit = hit.parent;
        }
        if (hit && hit.userData?.type) {
          handleInteractWithObject(hit);
        }
      }
    };

    renderer.domElement.addEventListener('click', onCanvasClick);

    // 18. WebXR Session State Bridge
    const onXRSessionStart = () => {
      onSessionChange && onSessionChange(true);
      recordMetric('vrExperiments');
      toast.success('WebXR Immersive-VR Session Started');
    };

    const onXRSessionEnd = () => {
      onSessionChange && onSessionChange(false);
      stopSpeech();
      toast('Exited VR Session: Returned to Desktop 3D Mode', { icon: '👓' });
    };

    renderer.xr.addEventListener('sessionstart', onXRSessionStart);
    renderer.xr.addEventListener('sessionend', onXRSessionEnd);

    // Expose enterVR function to parent component via ref
    if (triggerEnterVRRef) {
      triggerEnterVRRef.current = async () => {
        if (!('xr' in navigator)) {
          throw new Error('WebXR API is not supported in this browser.');
        }

        const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
        if (!isSupported) {
          throw new Error('WebXR immersive-vr is not supported or no VR headset is detected.');
        }

        const sessionInit = {
          optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking', 'layers']
        };

        const session = await navigator.xr.requestSession('immersive-vr', sessionInit);
        await renderer.xr.setSession(session);
      };
    }

    // 19. Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 20. Main Render Loop
    let clock = new THREE.Clock();

    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Rotate Qubit Gimbal Rings
      if (dynamicMeshes.qubit0Gimbal1) dynamicMeshes.qubit0Gimbal1.rotation.z += delta * 0.7;
      if (dynamicMeshes.qubit0Gimbal2) dynamicMeshes.qubit0Gimbal2.rotation.y += delta * 0.9;
      if (dynamicMeshes.qubit1Gimbal1) dynamicMeshes.qubit1Gimbal1.rotation.z -= delta * 0.7;
      if (dynamicMeshes.qubit1Gimbal2) dynamicMeshes.qubit1Gimbal2.rotation.y -= delta * 0.9;

      // Animate Superposition aura pulsing
      if (dynamicMeshes.superpositionAura0 && dynamicMeshes.superpositionAura0.material.opacity > 0) {
        const pulse = 1.0 + Math.sin(elapsedTime * 6) * 0.12;
        dynamicMeshes.superpositionAura0.scale.set(pulse, pulse, pulse);
      }

      // Animate Entanglement Energy Flow Particles
      if (dynamicMeshes.entanglementParticles && dynamicMeshes.entanglementParticles.material.opacity > 0) {
        const positions = dynamicMeshes.entanglementParticles.geometry.attributes.position.array;
        const count = positions.length / 3;
        for (let i = 0; i < count; i++) {
          const t = (i / count + elapsedTime * 0.4) % 1.0;
          const angle = t * Math.PI * 6 + elapsedTime * 2;
          positions[i * 3] = 1.22 + Math.cos(angle) * 0.045;
          positions[i * 3 + 1] = q0RailY + (q1RailY - q0RailY) * t;
          positions[i * 3 + 2] = Math.sin(angle) * 0.045;
        }
        dynamicMeshes.entanglementParticles.geometry.attributes.position.needsUpdate = true;
      }

      // Drifting Quantum Photons
      if (dynamicMeshes.quantumDust) {
        dynamicMeshes.quantumDust.rotation.y = elapsedTime * 0.02;
      }

      // Simulation Pulse movement
      if (stateRef.current.isSimulating && dynamicMeshes.simulationPulse) {
        dynamicMeshes.simulationPulse.position.x += delta * 2.8;
      }

      // Orbit controls update (only active when not presenting in VR)
      if (!renderer.xr.isPresenting) {
        controls.update();
      }

      renderer.render(scene, camera);
    });

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', onCanvasClick);
      renderer.xr.removeEventListener('sessionstart', onXRSessionStart);
      renderer.xr.removeEventListener('sessionend', onXRSessionEnd);
      stopSpeech();

      renderer.setAnimationLoop(null);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[650px] lg:h-[720px] rounded-3xl overflow-hidden border border-purple-500/30 bg-[#030712] shadow-2xl">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Spatial UI Overlay (For Desktop Mode Preview) */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950/85 border border-slate-700/80 backdrop-blur-md text-sm font-mono text-cyan-300 pointer-events-auto shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Active Gate: <strong className="text-white">{selectedGate}</strong></span>
        </div>

        <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950/85 border border-purple-500/40 backdrop-blur-md text-sm font-mono text-purple-200 pointer-events-auto shadow-lg">
          <span>Bell State: <strong className="text-white">|Φ⁺⟩ = (|00⟩+|11⟩)/√2</strong></span>
        </div>
      </div>

      {/* Subtle Hint Bar at Bottom */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300 pointer-events-none">
        <span className="bg-slate-950/85 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-md">
          🎮 Desktop: Left-click + drag to orbit • Right-click to pan • Scroll to zoom • Click 3D objects to interact
        </span>
        <span className="bg-slate-950/85 px-3.5 py-1.5 rounded-xl border border-slate-800 hidden sm:inline shadow-md">
          🥽 WebXR VR: 6DoF Headset Tracking • Motion Controllers • Hand Tracking
        </span>
      </div>
    </div>
  );
};

export default WebXRQuantumLab;
