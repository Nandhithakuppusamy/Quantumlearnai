import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'three/examples/jsm/webxr/XRHandModelFactory.js';
import {
  createPanelTexture,
  paintButton,
  paintExplanation,
  paintLabel,
  paintResults
} from './vrPanels';

const GATE_TOKENS = [
  { gate: 'H', color: 0x22d3ee },
  { gate: 'X', color: 0xa855f7 },
  { gate: 'Z', color: 0xf59e0b },
  { gate: 'S', color: 0xec4899 },
  { gate: 'T', color: 0xf43f5e },
  { gate: 'CNOT', color: 0x8b5cf6 }
];

const ACTION_BUTTONS = [
  { id: 'run', label: 'Run', accent: '#22d3ee' },
  { id: 'measure', label: 'Measure', accent: '#facc15' },
  { id: 'reset', label: 'Reset', accent: '#94a3b8' },
  { id: 'explain', label: 'AI', accent: '#c4b5fd' }
];

const WIRE_Y = [1.45, 1.1];
const WIRE_Z = -1.7;
const WIRE_START = -0.7;
const WIRE_END = 1.15;
const QUBIT_X = -0.95;
const GRAB_RADIUS = 0.16;
const PLACE_RADIUS = 0.5;

const tmpVector = new THREE.Vector3();
const tmpMatrix = new THREE.Matrix4();

/**
 * Immersive WebXR quantum laboratory. The same object powers the headset
 * session and the non-immersive desktop preview: only the input layer differs.
 */
export class QuantumVRScene {
  constructor(container, handlers = {}) {
    this.container = container;
    this.handlers = handlers;
    this.clock = new THREE.Clock();
    this.interactives = [];
    this.grabbables = [];
    this.held = new Map();
    this.session = null;
    this.circuit = [];
    this.result = null;
    this.measuredOutcome = null;
    this.runAnimation = null;
    this.entangled = false;
    this.superposed = [false, false];

    this.#initRenderer();
    this.#initScene();
    this.#initEnvironment();
    this.#initQubits();
    this.#initCircuitGroup();
    this.#initGatePalette();
    this.#initActionButtons();
    this.#initPanels();
    this.#initXRInput();
    this.#initDesktopInput();

    this.onResize = this.#resize.bind(this);
    window.addEventListener('resize', this.onResize);
    this.renderer.setAnimationLoop(this.#tick.bind(this));
  }

  /* ------------------------------------------------------------------ setup */

  #initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight || 420);
    this.renderer.xr.enabled = true;
    this.renderer.xr.setReferenceSpaceType('local-floor');
    this.renderer.shadowMap.enabled = false;
    this.container.appendChild(this.renderer.domElement);

    this.renderer.xr.addEventListener('sessionstart', () => {
      this.handlers.onSessionChange?.(true);
      this.setStatus('Immersive session active — grab a gate and drop it on a qubit.');
    });
    this.renderer.xr.addEventListener('sessionend', () => {
      this.session = null;
      this.handlers.onSessionChange?.(false);
      this.setStatus('Desktop 3D mode — drag with the mouse to look around.');
    });
  }

  #initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x05070f);
    this.scene.fog = new THREE.Fog(0x05070f, 6, 16);

    this.camera = new THREE.PerspectiveCamera(62, 1, 0.05, 60);
    this.camera.position.set(0, 1.8, 1.95);

    // The XR reference space puts the user at the origin; the desktop camera is
    // parented to the same rig so both views share one coordinate system.
    this.rig = new THREE.Group();
    this.rig.add(this.camera);
    this.scene.add(this.rig);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1.28, -1.25);
    this.controls.enablePan = false;
    this.controls.minDistance = 0.4;
    this.controls.maxDistance = 4.5;
    this.controls.maxPolarAngle = Math.PI * 0.85;
    this.controls.update();
  }

  #initEnvironment() {
    this.scene.add(new THREE.HemisphereLight(0x8ec5ff, 0x0b1020, 1.1));
    const key = new THREE.DirectionalLight(0x88e1ff, 1.4);
    key.position.set(2, 4, 1);
    this.scene.add(key);
    const rim = new THREE.PointLight(0xa855f7, 12, 12);
    rim.position.set(-2, 2.4, -2.5);
    this.scene.add(rim);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(7, 64),
      new THREE.MeshStandardMaterial({ color: 0x0a1020, roughness: 0.85, metalness: 0.1 })
    );
    floor.rotation.x = -Math.PI / 2;
    this.scene.add(floor);

    const grid = new THREE.GridHelper(14, 42, 0x22d3ee, 0x1e293b);
    grid.material.transparent = true;
    grid.material.opacity = 0.28;
    grid.position.y = 0.002;
    this.scene.add(grid);

    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(9, 32, 24),
      new THREE.MeshBasicMaterial({ color: 0x070c1a, side: THREE.BackSide })
    );
    this.scene.add(dome);

    // Lab console the student stands behind.
    const console3d = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 0.06, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x111a2e, roughness: 0.5, metalness: 0.4 })
    );
    console3d.position.set(0, 0.86, -0.75);
    this.scene.add(console3d);

    const consoleGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 0.55),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.12 })
    );
    consoleGlow.rotation.x = -Math.PI / 2;
    consoleGlow.position.set(0, 0.895, -0.75);
    this.scene.add(consoleGlow);
  }

  #initQubits() {
    this.qubits = [0, 1].map((index) => {
      const group = new THREE.Group();
      group.position.set(QUBIT_X, WIRE_Y[index], WIRE_Z);

      const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.11, 3),
        new THREE.MeshStandardMaterial({
          color: index === 0 ? 0x22d3ee : 0xa855f7,
          emissive: index === 0 ? 0x0e7490 : 0x6d28d9,
          emissiveIntensity: 0.8,
          roughness: 0.25,
          metalness: 0.5
        })
      );
      group.add(core);

      const halo = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.006, 12, 64),
        new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.0 })
      );
      halo.rotation.x = Math.PI / 2.4;
      group.add(halo);

      const label = this.#makeLabelSprite(`q${index}`, 0.16);
      label.position.set(-0.24, 0.02, 0);
      group.add(label);

      const state = this.#makeLabelSprite('|0⟩', 0.14, '#94a3b8');
      state.position.set(0, -0.2, 0);
      group.add(state);

      group.userData = { kind: 'qubit', index, core, halo, state, spin: 0 };
      this.scene.add(group);

      const wire = new THREE.Mesh(
        new THREE.BoxGeometry(WIRE_END - WIRE_START, 0.006, 0.006),
        new THREE.MeshBasicMaterial({ color: 0x334155 })
      );
      wire.position.set((WIRE_START + WIRE_END) / 2, WIRE_Y[index], WIRE_Z);
      this.scene.add(wire);

      return group;
    });

    this.entanglementBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, WIRE_Y[0] - WIRE_Y[1], 12, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0 })
    );
    this.entanglementBeam.position.set(QUBIT_X, (WIRE_Y[0] + WIRE_Y[1]) / 2, WIRE_Z);
    this.scene.add(this.entanglementBeam);
  }

  #initCircuitGroup() {
    this.circuitGroup = new THREE.Group();
    this.scene.add(this.circuitGroup);
  }

  #initGatePalette() {
    this.palette = new THREE.Group();
    this.palette.position.set(0, 0.95, -0.72);
    this.scene.add(this.palette);

    GATE_TOKENS.forEach(({ gate, color }, index) => {
      const token = this.#makeGateMesh(gate, color);
      token.position.set(-0.66 + index * 0.265, 0.03, 0);
      token.userData = { kind: 'gate', gate, color, home: token.position.clone(), isToken: true };
      this.palette.add(token);
      this.grabbables.push(token);
    });

    const hint = this.#makeLabelSprite('GATE PALETTE', 0.07, '#64748b');
    hint.position.set(-0.62, 0.17, 0);
    this.palette.add(hint);
  }

  #initActionButtons() {
    this.buttons = ACTION_BUTTONS.map(({ id, label, accent }, index) => {
      const { canvas, context, texture } = createPanelTexture(256, 128);
      paintButton(context, label, { accent });
      texture.needsUpdate = true;
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.24, 0.12),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true })
      );
      mesh.position.set(-0.42 + index * 0.28, 0.9, -0.42);
      mesh.rotation.x = -Math.PI / 3.1;
      mesh.userData = {
        kind: 'button',
        id,
        label,
        accent,
        canvas,
        context,
        texture,
        activeUntil: 0
      };
      this.scene.add(mesh);
      this.interactives.push(mesh);
      return mesh;
    });
  }

  #initPanels() {
    const results = createPanelTexture(512, 512);
    this.resultsPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(0.78, 0.78),
      new THREE.MeshBasicMaterial({ map: results.texture, transparent: true })
    );
    this.resultsPanel.position.set(1.4, 1.5, -1.25);
    this.resultsPanel.rotation.y = -Math.PI / 4;
    this.resultsPanel.userData = results;
    this.scene.add(this.resultsPanel);

    const explanation = createPanelTexture(512, 512);
    this.explanationPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(0.78, 0.78),
      new THREE.MeshBasicMaterial({ map: explanation.texture, transparent: true })
    );
    this.explanationPanel.position.set(-1.4, 1.5, -1.25);
    this.explanationPanel.rotation.y = Math.PI / 4;
    this.explanationPanel.userData = explanation;
    this.scene.add(this.explanationPanel);

    this.statusSprite = this.#makeLabelSprite('Initialising quantum lab…', 0.16, '#94a3b8', 1024, 96);
    this.statusSprite.position.set(0, 1.95, WIRE_Z + 0.1);
    this.scene.add(this.statusSprite);

    paintExplanation(explanation.context, {
      title: 'AI tutor',
      body: 'Grab the H gate and drop it on q0 to create a superposition, then drop CNOT on q0 to entangle both qubits.'
    });
    explanation.texture.needsUpdate = true;
  }

  #initXRInput() {
    const controllerModelFactory = new XRControllerModelFactory();
    const handModelFactory = new XRHandModelFactory();
    this.controllers = [];
    this.hands = [];

    const rayGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1)
    ]);

    for (let i = 0; i < 2; i += 1) {
      const controller = this.renderer.xr.getController(i);
      const ray = new THREE.Line(rayGeometry, new THREE.LineBasicMaterial({ color: 0x67e8f9 }));
      ray.scale.z = 3;
      controller.add(ray);
      controller.userData = { index: i, kind: 'controller' };
      controller.addEventListener('selectstart', () => this.#onSelectStart(controller));
      controller.addEventListener('selectend', () => this.#onSelectEnd(controller));
      this.rig.add(controller);
      this.controllers.push(controller);

      const grip = this.renderer.xr.getControllerGrip(i);
      grip.add(controllerModelFactory.createControllerModel(grip));
      this.rig.add(grip);

      const hand = this.renderer.xr.getHand(i);
      hand.add(handModelFactory.createHandModel(hand, 'mesh'));
      hand.userData = { index: i, kind: 'hand', pinching: false };
      this.rig.add(hand);
      this.hands.push(hand);
    }
  }

  #initDesktopInput() {
    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.desktopHeld = null;

    this.onPointerMove = (event) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
    };
    this.onPointerDown = () => {
      if (this.renderer.xr.isPresenting) return;
      this.#desktopClick();
    };

    this.renderer.domElement.addEventListener('pointermove', this.onPointerMove);
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
  }

  /* --------------------------------------------------------------- builders */

  #makeLabelSprite(text, height = 0.12, accent = '#e2e8f0', width = 512, canvasHeight = 256) {
    const { context, texture } = createPanelTexture(width, canvasHeight);
    paintLabel(context, text, { accent, size: Math.round(canvasHeight * 0.52) });
    texture.needsUpdate = true;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
    sprite.scale.set((height * width) / canvasHeight, height, 1);
    sprite.userData = { context, texture, accent, canvasHeight };
    return sprite;
  }

  #updateLabelSprite(sprite, text, accent) {
    const { context, texture, canvasHeight } = sprite.userData;
    paintLabel(context, text, {
      accent: accent || sprite.userData.accent,
      size: Math.round(canvasHeight * 0.52)
    });
    texture.needsUpdate = true;
  }

  #makeGateMesh(gate, color, scale = 1) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.13 * scale, 0.13 * scale, 0.13 * scale),
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.35,
        roughness: 0.3,
        metalness: 0.45
      })
    );
    group.add(body);
    const glyph = this.#makeLabelSprite(gate === 'CNOT' ? '⊕' : gate, 0.075 * scale, '#f8fafc');
    glyph.position.set(0, 0, 0.075 * scale);
    group.add(glyph);
    return group;
  }

  /* ---------------------------------------------------------------- public */

  setCircuit(circuit = []) {
    this.circuit = circuit;
    while (this.circuitGroup.children.length) {
      const child = this.circuitGroup.children.pop();
      child.traverse?.((node) => {
        node.geometry?.dispose?.();
        node.material?.map?.dispose?.();
        node.material?.dispose?.();
      });
    }

    const steps = circuit.filter(Boolean);
    const span = WIRE_END - WIRE_START - 0.2;
    steps.forEach((step, index) => {
      const x = WIRE_START + 0.16 + (steps.length > 1 ? (span * index) / (steps.length - 1) : span / 2);
      if (step.type === 'cnot') {
        const control = new THREE.Mesh(
          new THREE.SphereGeometry(0.035, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x6d28d9, emissiveIntensity: 0.6 })
        );
        control.position.set(x, WIRE_Y[step.control], WIRE_Z);
        this.circuitGroup.add(control);

        const target = this.#makeGateMesh('CNOT', 0x8b5cf6, 0.75);
        target.position.set(x, WIRE_Y[step.target], WIRE_Z);
        this.circuitGroup.add(target);

        const link = new THREE.Mesh(
          new THREE.CylinderGeometry(0.006, 0.006, Math.abs(WIRE_Y[0] - WIRE_Y[1]), 8),
          new THREE.MeshBasicMaterial({ color: 0x8b5cf6 })
        );
        link.position.set(x, (WIRE_Y[0] + WIRE_Y[1]) / 2, WIRE_Z);
        this.circuitGroup.add(link);
        return;
      }

      [step.q0, step.q1].forEach((gate, qubit) => {
        if (!gate) return;
        const color = gate === 'M' ? 0x64748b : (GATE_TOKENS.find((token) => token.gate === gate)?.color ?? 0x22d3ee);
        const mesh = this.#makeGateMesh(gate, color, 0.75);
        mesh.position.set(x, WIRE_Y[qubit], WIRE_Z);
        this.circuitGroup.add(mesh);
      });
    });
  }

  setResult(result) {
    this.result = result;
    this.measuredOutcome = null;
    const { context, texture } = this.resultsPanel.userData;
    paintResults(context, {
      probabilities: result?.probabilities,
      shotCounts: result?.shotCounts,
      totalShots: result?.totalShots,
      measured: null
    });
    texture.needsUpdate = true;

    const bloch = result?.bloch;
    this.entangled = Boolean(bloch?.q0?.isEntangled && bloch?.q1?.isEntangled);
    this.superposed = [Math.abs(bloch?.q0?.z ?? 1) < 0.9, Math.abs(bloch?.q1?.z ?? 1) < 0.9];
    this.qubits.forEach((qubit, index) => {
      this.#updateLabelSprite(
        qubit.userData.state,
        this.superposed[index] ? '|0⟩+|1⟩' : (bloch?.[`q${index}`]?.z ?? 1) < 0 ? '|1⟩' : '|0⟩',
        this.superposed[index] ? '#67e8f9' : '#94a3b8'
      );
    });
  }

  setExplanation({ title, body }) {
    const { context, texture } = this.explanationPanel.userData;
    paintExplanation(context, { title, body });
    texture.needsUpdate = true;
  }

  setStatus(text) {
    this.#updateLabelSprite(this.statusSprite, text, '#94a3b8');
  }

  playRunAnimation() {
    this.runAnimation = { elapsed: 0 };
  }

  showMeasurement(outcome) {
    this.measuredOutcome = outcome;
    const { context, texture } = this.resultsPanel.userData;
    paintResults(context, {
      probabilities: this.result?.probabilities,
      shotCounts: this.result?.shotCounts,
      totalShots: this.result?.totalShots,
      measured: outcome
    });
    texture.needsUpdate = true;
    this.superposed = [false, false];
    this.qubits.forEach((qubit, index) => {
      this.#updateLabelSprite(qubit.userData.state, `|${outcome[index]}⟩`, '#facc15');
      qubit.userData.core.material.emissiveIntensity = 1.6;
    });
  }

  async enterVR() {
    if (!navigator.xr) throw new Error('WebXR is unavailable in this browser.');
    const session = await navigator.xr.requestSession('immersive-vr', {
      optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking', 'layers']
    });
    this.session = session;
    await this.renderer.xr.setSession(session);
    return session;
  }

  exitVR() {
    this.session?.end?.();
  }

  dispose() {
    window.removeEventListener('resize', this.onResize);
    this.renderer.domElement.removeEventListener('pointermove', this.onPointerMove);
    this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.renderer.setAnimationLoop(null);
    this.session?.end?.().catch?.(() => {});
    this.controls.dispose();
    this.scene.traverse((node) => {
      node.geometry?.dispose?.();
      if (Array.isArray(node.material)) node.material.forEach((material) => material.dispose());
      else {
        node.material?.map?.dispose?.();
        node.material?.dispose?.();
      }
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  /* -------------------------------------------------------------- interaction */

  #raycastFrom(object) {
    tmpMatrix.identity().extractRotation(object.matrixWorld);
    this.raycaster.ray.origin.setFromMatrixPosition(object.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tmpMatrix);
    return this.raycaster.intersectObjects([...this.interactives, ...this.grabbables], true)[0];
  }

  #resolveInteractive(object) {
    let node = object;
    while (node) {
      if (node.userData?.kind === 'button' || node.userData?.kind === 'gate') return node;
      node = node.parent;
    }
    return null;
  }

  #grab(source, token) {
    const clone = this.#makeGateMesh(token.userData.gate, token.userData.color, 0.9);
    clone.userData = { kind: 'gate', gate: token.userData.gate, color: token.userData.color };
    clone.position.set(0, 0, -0.12);
    source.add(clone);
    this.held.set(source, clone);
    this.setStatus(`Holding ${token.userData.gate} — release it over a qubit to place it.`);
  }

  #release(source) {
    const held = this.held.get(source);
    if (!held) return;
    held.getWorldPosition(tmpVector);
    source.remove(held);
    this.held.delete(source);

    let nearest = null;
    let nearestDistance = PLACE_RADIUS;
    this.qubits.forEach((qubit) => {
      const distance = qubit.getWorldPosition(new THREE.Vector3()).distanceTo(tmpVector);
      if (distance < nearestDistance) {
        nearest = qubit;
        nearestDistance = distance;
      }
    });

    if (!nearest) {
      this.setStatus('Gate released into empty space — try dropping it closer to a qubit.');
      return;
    }

    const gate = held.userData.gate;
    const qubitIndex = nearest.userData.index;
    if (gate === 'CNOT') {
      this.handlers.onPlaceCnot?.(qubitIndex);
      this.setStatus(`CNOT connected: control q${qubitIndex} → target q${qubitIndex === 0 ? 1 : 0}.`);
    } else {
      this.handlers.onPlaceGate?.(gate, qubitIndex);
      this.setStatus(`${gate} placed on q${qubitIndex}.`);
    }
  }

  #activateButton(mesh) {
    const { id, label, accent, context, texture } = mesh.userData;
    paintButton(context, label, { accent, active: true });
    texture.needsUpdate = true;
    mesh.userData.activeUntil = this.clock.getElapsedTime() + 0.25;
    this.handlers.onAction?.(id);
  }

  #onSelectStart(controller) {
    const hit = this.#raycastFrom(controller);
    const node = hit && this.#resolveInteractive(hit.object);
    if (!node) return;
    if (node.userData.kind === 'button') this.#activateButton(node);
    else if (node.userData.isToken) this.#grab(controller, node);
  }

  #onSelectEnd(controller) {
    this.#release(controller);
  }

  #updateHands() {
    for (const hand of this.hands) {
      const indexTip = hand.joints?.['index-finger-tip'];
      const thumbTip = hand.joints?.['thumb-tip'];
      if (!indexTip || !thumbTip) continue;

      const pinchDistance = indexTip.position.distanceTo(thumbTip.position);
      const pinching = pinchDistance < 0.025;
      const pinchPoint = indexTip.getWorldPosition(new THREE.Vector3());

      if (pinching && !hand.userData.pinching) {
        hand.userData.pinching = true;
        const token = this.grabbables.find(
          (candidate) => candidate.getWorldPosition(new THREE.Vector3()).distanceTo(pinchPoint) < GRAB_RADIUS
        );
        if (token) this.#grab(hand, token);
        else {
          const button = this.buttons.find(
            (candidate) => candidate.getWorldPosition(new THREE.Vector3()).distanceTo(pinchPoint) < GRAB_RADIUS
          );
          if (button) this.#activateButton(button);
        }
      } else if (!pinching && hand.userData.pinching) {
        hand.userData.pinching = false;
        this.#release(hand);
      }
    }
  }

  #desktopClick() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(
      [...this.interactives, ...this.grabbables, ...this.qubits],
      true
    );
    if (!hits.length) return;

    let qubitNode = hits[0].object;
    while (qubitNode && qubitNode.userData?.kind !== 'qubit') qubitNode = qubitNode.parent;

    if (this.desktopHeld && qubitNode) {
      const gate = this.desktopHeld;
      this.desktopHeld = null;
      if (gate === 'CNOT') this.handlers.onPlaceCnot?.(qubitNode.userData.index);
      else this.handlers.onPlaceGate?.(gate, qubitNode.userData.index);
      this.setStatus(`${gate} placed on q${qubitNode.userData.index}.`);
      return;
    }

    const node = this.#resolveInteractive(hits[0].object);
    if (!node) return;
    if (node.userData.kind === 'button') {
      this.#activateButton(node);
      return;
    }
    if (node.userData.isToken) {
      this.desktopHeld = node.userData.gate;
      this.setStatus(`${this.desktopHeld} selected — click a qubit to place it.`);
    }
  }

  /* ------------------------------------------------------------------- loop */

  #resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 420;
    if (!width || !height) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  #tick() {
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    this.palette.children.forEach((child, index) => {
      if (child.userData?.isToken) child.rotation.y = time * 0.6 + index;
    });

    this.qubits.forEach((qubit, index) => {
      const { core, halo } = qubit.userData;
      const active = this.superposed[index];
      core.rotation.y += delta * (active ? 2.4 : 0.4);
      core.rotation.x += delta * (active ? 1.1 : 0.15);
      const pulse = active ? 0.9 + Math.sin(time * 4 + index) * 0.35 : 0.65;
      core.material.emissiveIntensity = this.measuredOutcome ? 1.6 : pulse;
      halo.material.opacity = active ? 0.35 + Math.sin(time * 3 + index) * 0.2 : 0;
      halo.rotation.z += delta * (active ? 1.6 : 0.2);
    });

    const beamTarget = this.entangled ? 0.35 + Math.sin(time * 5) * 0.2 : 0;
    this.entanglementBeam.material.opacity += (beamTarget - this.entanglementBeam.material.opacity) * Math.min(1, delta * 6);
    this.entanglementBeam.scale.x = this.entanglementBeam.scale.z = this.entangled
      ? 1 + Math.sin(time * 6) * 0.25
      : 1;

    if (this.runAnimation) {
      this.runAnimation.elapsed += delta;
      const progress = Math.min(1, this.runAnimation.elapsed / 1.8);
      this.circuitGroup.children.forEach((child, index) => {
        const reached = progress > index / Math.max(1, this.circuitGroup.children.length);
        child.scale.setScalar(reached ? 1 + Math.sin(time * 9) * 0.08 : 0.85);
      });
      if (progress >= 1) {
        this.runAnimation = null;
        this.circuitGroup.children.forEach((child) => child.scale.setScalar(1));
      }
    }

    this.buttons.forEach((button) => {
      if (button.userData.activeUntil && time > button.userData.activeUntil) {
        button.userData.activeUntil = 0;
        paintButton(button.userData.context, button.userData.label, { accent: button.userData.accent });
        button.userData.texture.needsUpdate = true;
      }
    });

    if (this.renderer.xr.isPresenting) this.#updateHands();
    else this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }
}

export default QuantumVRScene;
