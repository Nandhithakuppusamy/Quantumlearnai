import * as THREE from 'three';

// Utility to wrap text cleanly on HTML5 Canvas
const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
};

// Create text badge texture (e.g. qubit names, status badges)
export const createTextBadgeTexture = ({
  text,
  subtext = '',
  bgColor = '#080d1a',
  borderColor = '#06b6d4',
  textColor = '#38bdf8',
  subtextColor = '#94a3b8',
  width = 512,
  height = 192
}) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Background rounded rect
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(8, 8, width - 16, height - 16, 24);
  ctx.fill();

  // Border
  ctx.lineWidth = 6;
  ctx.strokeStyle = borderColor;
  ctx.stroke();

  // Primary Text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = textColor;
  ctx.font = 'bold 52px "Segoe UI", Inter, sans-serif';
  ctx.fillText(text, width / 2, subtext ? height / 2 - 20 : height / 2);

  // Subtext
  if (subtext) {
    ctx.fillStyle = subtextColor;
    ctx.font = '300 24px "Segoe UI", Inter, monospace';
    ctx.fillText(subtext, width / 2, height / 2 + 35);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

// Create Gate icon/block texture (H, X, Y, Z, CNOT, M, 🗑)
export const createGateTexture = (gate, color = '#06b6d4') => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Background
  const gradient = ctx.createLinearGradient(0, 0, 256, 256);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, '#020617');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(8, 8, 240, 240, 36);
  ctx.fill();

  // Glowing Border
  ctx.lineWidth = 8;
  ctx.strokeStyle = color;
  ctx.stroke();

  // Gate Symbol
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = color;
  ctx.shadowBlur = 15;

  if (gate === 'CNOT') {
    ctx.font = 'bold 72px "Segoe UI", Inter, sans-serif';
    ctx.fillText('⊕', 128, 105);
    ctx.font = 'bold 26px "Segoe UI", Inter, sans-serif';
    ctx.fillStyle = color;
    ctx.fillText('CNOT', 128, 175);
  } else if (gate === 'M') {
    ctx.font = 'bold 76px "Segoe UI", Inter, sans-serif';
    ctx.fillText('⚡', 128, 105);
    ctx.font = 'bold 26px "Segoe UI", Inter, sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('MEASURE', 128, 175);
  } else if (gate === 'CLEAR' || gate === 'TRASH') {
    ctx.font = 'bold 68px "Segoe UI", Inter, sans-serif';
    ctx.fillText('🗑', 128, 110);
    ctx.font = 'bold 24px "Segoe UI", Inter, sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('REMOVE', 128, 175);
  } else {
    ctx.font = 'bold 96px "Segoe UI", Inter, sans-serif';
    ctx.fillText(gate, 128, 120);
    ctx.font = 'bold 22px "Segoe UI", Inter, monospace';
    ctx.fillStyle = color;
    const labels = { H: 'HADAMARD', X: 'NOT / FLIP', Y: 'PAULI-Y', Z: 'PHASE-Z', S: 'PHASE-S', T: 'PI/8' };
    ctx.fillText(labels[gate] || 'GATE', 128, 190);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

// Create 3D Holographic Button Texture
export const createButtonTexture = ({
  text,
  icon = '',
  bgColor = '#0f172a',
  borderColor = '#06b6d4',
  textColor = '#ffffff',
  highlight = false,
  width = 384,
  height = 112
}) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = highlight ? '#1e293b' : bgColor;
  ctx.beginPath();
  ctx.roundRect(6, 6, width - 12, height - 12, 20);
  ctx.fill();

  ctx.lineWidth = highlight ? 6 : 4;
  ctx.strokeStyle = borderColor;
  ctx.shadowColor = borderColor;
  ctx.shadowBlur = highlight ? 18 : 6;
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = textColor;
  ctx.font = 'bold 36px "Segoe UI", Inter, sans-serif';
  ctx.fillText(`${icon ? icon + ' ' : ''}${text}`, width / 2, height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

// Create 3D Holographic Measurement Display Texture
export const createMeasurementBoardTexture = (probabilities = { '00': 0.5, '01': 0, '10': 0, '11': 0.5 }, shotCounts = {}) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Background
  const grad = ctx.createLinearGradient(0, 0, 0, 768);
  grad.addColorStop(0, '#0a101f');
  grad.addColorStop(1, '#030712');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(10, 10, 1004, 748, 36);
  ctx.fill();

  // Cyan Neon Frame
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#06b6d4';
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 16;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Header Banner
  ctx.fillStyle = '#06b6d4';
  ctx.font = 'bold 44px "Segoe UI", Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('⚡ QUANTUM MEASUREMENT COLLAPSE', 48, 80);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '24px "Segoe UI", Inter, monospace';
  ctx.fillText('BASIS PROBABILITIES & SHOT DISTRIBUTIONS (N=1000)', 48, 120);

  // Divider Line
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(48, 145);
  ctx.lineTo(976, 145);
  ctx.stroke();

  // Basis States Rows
  const states = ['00', '01', '10', '11'];
  const startY = 200;
  const rowHeight = 110;

  states.forEach((state, i) => {
    const y = startY + i * rowHeight;
    const prob = probabilities[state] || 0;
    const pct = Math.round(prob * 100);
    const shots = shotCounts[state] !== undefined ? shotCounts[state] : Math.round(prob * 1000);

    // State Label
    ctx.font = 'bold 38px monospace';
    ctx.fillStyle = prob > 0.05 ? '#38bdf8' : '#64748b';
    ctx.fillText(`|${state}⟩`, 50, y);

    // Track Background
    const barX = 170;
    const maxBarW = 600;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(barX, y - 28, maxBarW, 36, 18);
    ctx.fill();

    // Filled Bar
    if (pct > 0) {
      const barGrad = ctx.createLinearGradient(barX, 0, barX + maxBarW * prob, 0);
      if (state === '00') {
        barGrad.addColorStop(0, '#06b6d4');
        barGrad.addColorStop(1, '#3b82f6');
      } else if (state === '11') {
        barGrad.addColorStop(0, '#8b5cf6');
        barGrad.addColorStop(1, '#ec4899');
      } else {
        barGrad.addColorStop(0, '#64748b');
        barGrad.addColorStop(1, '#94a3b8');
      }
      ctx.fillStyle = barGrad;
      ctx.beginPath();
      ctx.roundRect(barX, y - 28, Math.max(12, maxBarW * prob), 36, 18);
      ctx.fill();
    }

    // Percentage & Shots Text
    ctx.font = 'bold 34px "Segoe UI", Inter, sans-serif';
    ctx.fillStyle = prob > 0.05 ? '#f8fafc' : '#475569';
    ctx.textAlign = 'right';
    ctx.fillText(`${pct}%`, 860, y);

    ctx.font = '22px monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`${shots} shots`, 976, y);
    ctx.textAlign = 'left';
  });

  // Footer Educational Insight Box
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(48, 620, 928, 100, 20);
  ctx.fill();
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.stroke();

  const isBell = (probabilities['00'] > 0.4 && probabilities['11'] > 0.4 && (probabilities['01'] || 0) < 0.05);
  ctx.font = 'bold 24px "Segoe UI", Inter, sans-serif';
  ctx.fillStyle = isBell ? '#38bdf8' : '#e2e8f0';
  ctx.fillText(
    isBell
      ? '★ PERFECT BELL CORRELATION: Qubits 0 and 1 ALWAYS yield identical outcomes!'
      : '• Simulated Quantum State: Probabilities determined by exact unitary evolution.',
    70,
    660
  );

  ctx.font = '20px "Segoe UI", Inter, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(
    isBell
      ? 'Measuring q₀ instantly projects q₁ into the exact same value across space.'
      : 'Modify gates on the workbench and trigger measurement to observe quantum wave collapse.',
    70,
    695
  );

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

// Create 3D Holographic AI Tutor Panel Texture
export const createAITutorBoardTexture = ({
  topicTitle = 'Bell State (|Φ⁺⟩)',
  explanation = 'Hadamard creates superposition (|0⟩+|1⟩)/√2 on q₀. CNOT entangles q₀ and q₁ into (|00⟩+|11⟩)/√2.',
  keyPoints = [
    'H gate creates 50/50 superposition on qubit 0',
    'CNOT entangles both qubits into a non-separable Bell state',
    'Simultaneous measurement collapses them strictly into |00⟩ or |11⟩'
  ],
  status = 'Online • Ready to assist'
}) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Background
  const grad = ctx.createLinearGradient(0, 0, 0, 768);
  grad.addColorStop(0, '#100a26');
  grad.addColorStop(1, '#05030d');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(10, 10, 1004, 748, 36);
  ctx.fill();

  // Purple Neon Border
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#a855f7';
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 16;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // AI Header
  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 44px "Segoe UI", Inter, sans-serif';
  ctx.fillText('🤖 AI QUANTUM TUTOR (VR INTERACTIVE)', 48, 80);

  ctx.fillStyle = '#4ade80';
  ctx.font = '22px "Segoe UI", Inter, monospace';
  ctx.fillText(`● STATUS: ${status}`, 48, 120);

  // Line
  ctx.strokeStyle = '#2e1065';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(48, 145);
  ctx.lineTo(976, 145);
  ctx.stroke();

  // Topic Title
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 36px "Segoe UI", Inter, sans-serif';
  ctx.fillText(topicTitle, 48, 200);

  // Explanation body
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '26px "Segoe UI", Inter, sans-serif';
  wrapText(ctx, explanation, 48, 248, 920, 38);

  // Key Insights Heading
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 28px "Segoe UI", Inter, sans-serif';
  ctx.fillText('KEY EDUCATIONAL INSIGHTS:', 48, 410);

  // Key points
  keyPoints.forEach((pt, idx) => {
    const y = 460 + idx * 56;
    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 26px "Segoe UI", Inter, sans-serif';
    ctx.fillText('▸', 48, y);

    ctx.fillStyle = '#f1f5f9';
    ctx.font = '24px "Segoe UI", Inter, sans-serif';
    ctx.fillText(pt, 78, y);
  });

  // Action Bar at Bottom
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.roundRect(48, 640, 928, 80, 20);
  ctx.fill();
  ctx.strokeStyle = '#818cf8';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = 'bold 24px "Segoe UI", Inter, sans-serif';
  ctx.fillStyle = '#e0e7ff';
  ctx.textAlign = 'center';
  ctx.fillText('💡 Point VR Controller Laser at buttons below to ask questions or listen to audio!', 512, 690);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
};
