import * as THREE from 'three';

/** Canvas-backed textures used for every readable surface inside the VR lab. */
export const createPanelTexture = (width = 512, height = 512) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { canvas, context: canvas.getContext('2d'), texture };
};

export const wrapText = (context, text, maxWidth) => {
  const lines = [];
  for (const paragraph of String(text).split('\n')) {
    let line = '';
    for (const word of paragraph.split(' ')) {
      const candidate = line ? `${line} ${word}` : word;
      if (context.measureText(candidate).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    lines.push(line);
  }
  return lines;
};

const roundedRect = (context, x, y, width, height, radius) => {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
};

export const paintPanelBackground = (context, { accent = '#22d3ee' } = {}) => {
  const { width, height } = context.canvas;
  context.clearRect(0, 0, width, height);
  context.fillStyle = 'rgba(5, 8, 18, 0.94)';
  roundedRect(context, 6, 6, width - 12, height - 12, 28);
  context.fill();
  context.strokeStyle = accent;
  context.lineWidth = 4;
  context.stroke();
};

export const paintTitle = (context, title, accent = '#22d3ee') => {
  context.fillStyle = accent;
  context.font = 'bold 30px "Plus Jakarta Sans", system-ui, sans-serif';
  context.textAlign = 'left';
  context.fillText(title.toUpperCase(), 36, 62);
};

/** Probability read-out shown on the wall of the virtual lab. */
export const paintResults = (context, { probabilities, shotCounts, totalShots, measured }) => {
  paintPanelBackground(context, { accent: '#22d3ee' });
  paintTitle(context, 'Measurement results');

  const entries = ['00', '01', '10', '11'];
  entries.forEach((basis, index) => {
    const probability = probabilities?.[basis] ?? 0;
    const y = 120 + index * 78;
    context.font = 'bold 30px "JetBrains Mono", monospace';
    context.fillStyle = measured === basis ? '#f8fafc' : '#cbd5f5';
    context.fillText(`|${basis}⟩`, 36, y + 30);

    context.fillStyle = 'rgba(148, 163, 184, 0.25)';
    roundedRect(context, 150, y + 6, 250, 30, 15);
    context.fill();

    const gradient = context.createLinearGradient(150, 0, 400, 0);
    gradient.addColorStop(0, '#22d3ee');
    gradient.addColorStop(1, '#a855f7');
    context.fillStyle = gradient;
    roundedRect(context, 150, y + 6, Math.max(6, 250 * probability), 30, 15);
    context.fill();

    context.fillStyle = '#e2e8f0';
    context.font = 'bold 28px "Plus Jakarta Sans", system-ui, sans-serif';
    context.fillText(`${Math.round(probability * 100)}%`, 418, y + 32);
  });

  context.font = '22px "JetBrains Mono", monospace';
  context.fillStyle = '#64748b';
  context.fillText(`${totalShots || 0} shots · ${shotCounts?.['00'] ?? 0}/${shotCounts?.['11'] ?? 0} correlated`, 36, 452);
  if (measured) {
    context.fillStyle = '#facc15';
    context.font = 'bold 26px "Plus Jakarta Sans", system-ui, sans-serif';
    context.fillText(`Collapsed to |${measured}⟩`, 36, 488);
  }
};

/** AI Tutor explanation surface. */
export const paintExplanation = (context, { title, body }) => {
  paintPanelBackground(context, { accent: '#a855f7' });
  paintTitle(context, title || 'AI tutor', '#c4b5fd');
  context.font = '25px "Plus Jakarta Sans", system-ui, sans-serif';
  context.fillStyle = '#e2e8f0';
  const lines = wrapText(context, body || '', context.canvas.width - 72);
  lines.slice(0, 13).forEach((line, index) => {
    context.fillText(line, 36, 120 + index * 34);
  });
};

/** Small floating labels (qubit names, gate glyphs, status line). */
export const paintLabel = (context, text, { accent = '#e2e8f0', size = 84, family = '"JetBrains Mono", monospace' } = {}) => {
  const { width, height } = context.canvas;
  context.clearRect(0, 0, width, height);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = accent;

  // Shrink to fit so long status lines are never clipped by the canvas edge.
  let fontSize = Math.min(size, height * 0.8);
  do {
    context.font = `bold ${fontSize}px ${family}`;
    if (context.measureText(text).width <= width * 0.94) break;
    fontSize -= 2;
  } while (fontSize > 8);

  context.fillText(text, width / 2, height / 2);
};

export const paintButton = (context, label, { accent = '#22d3ee', active = false } = {}) => {
  const { width, height } = context.canvas;
  context.clearRect(0, 0, width, height);
  context.fillStyle = active ? 'rgba(34, 211, 238, 0.35)' : 'rgba(8, 12, 24, 0.92)';
  roundedRect(context, 4, 4, width - 8, height - 8, 24);
  context.fill();
  context.strokeStyle = accent;
  context.lineWidth = 5;
  context.stroke();
  context.fillStyle = active ? '#f8fafc' : accent;
  context.font = 'bold 54px "Plus Jakarta Sans", system-ui, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(label.toUpperCase(), width / 2, height / 2 + 4);
};
