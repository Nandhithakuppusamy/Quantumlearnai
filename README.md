# QuantumLearn AI — AI Interactive Quantum Algorithm Learning Platform

**Problem ID:** SIH26140  
**Theme:** Smart Education (SIH 2026)  
**Project Name:** QuantumLearn AI  

QuantumLearn AI is a modern, interactive, AI-powered quantum computing education platform where students can intuitively learn quantum algorithms, build and edit quantum circuits, simulate quantum states locally, visualize 3D Bloch sphere projections, analyze measurement probability histograms, interact with an AI Quantum Tutor, take topic quizzes, and track learning mastery.

---

## 🚀 Quick Start Instructions

The application requires **Node.js (v18+)** and **npm**.

### Option 1: Run from Root Directory
```bash
npm install
npm run dev
```

### Option 2: Run from Client Directory
```bash
cd client
npm install
npm run dev
```

The application will be accessible at: `http://localhost:5173`

---

## 🌟 Key Features & SIH Innovation Highlights

### 1. 🧪 Quantum Learning Lab (`/lab`)
* **Interactive Circuit Canvas**: Visual quantum wire workbench supporting $H, X, Y, Z, S, T, CNOT,$ and $M$ gates. Add, modify, or remove gates interactively.
* **Educational Local Quantum Simulator**:
  * Exact 2-qubit state vector linear algebra with complex amplitudes and Kronecker tensor products.
  * Born-rule measurement probabilities with multinomial 1000-shot sampling.
  * Execution time metrics (~0.02s) with clear educational simulator labeling (no false claims of real quantum hardware).
* **SVG 3D Bloch Sphere**:
  * Interactive 3D perspective wireframe Bloch sphere with $X, Y, Z$ axes, $|0\rangle$ (North pole) and $|1\rangle$ (South pole) indicators.
  * Real-time state vector arrow $(\theta, \phi)$ with qubit selector ($q_0$ vs $q_1$) displaying reduced density coordinates.
  * Explains pure states on the surface and entangled mixed states in the interior ($r < 1$).
* **🤖 Quantum AI Tutor**:
  * Context-aware pedagogical tutor providing live explanations of loaded circuits.
  * Suggested inquiry chips for rapid learning.
  * Local semantic knowledge engine answering 40+ quantum computing concepts without requiring external API keys.

### 2. ⚡ Presentation Mode for SIH Evaluators
* Click **"Presentation Mode"** in the top header for an uncluttered jury showcase.
* 1-Click algorithm demonstrations:
  * **Bell State ($|\Phi^+\rangle$)**: Maximal entanglement $\frac{|00\rangle + |11\rangle}{\sqrt{2}}$ yielding correlated 50% $|00\rangle$ and 50% $|11\rangle$.
  * **Grover's Search**: Amplitude amplification on 2 qubits demonstrating quadratic speedup.
  * **Quantum Teleportation**: Disembodied state transmission via shared EPR pairs and 2 classical bits.
  * **Deutsch-Jozsa**: Exponential single-query separation between constant and balanced functions.
* Includes evaluator talking points on mathematical fidelity and zero-cloud resilience.

### 3. 📊 Dashboard (`/`)
* Personalized student greeting based on time of day.
* Key performance metrics: 68% Learning Progress, 4/8 Algorithms Learned, 84% Quiz Accuracy, 7-Day Active Streak.
* Interactive 6-step **Learning Path Roadmap**: *Quantum Basics $\to$ Gates $\to$ Superposition $\to$ Entanglement $\to$ Algorithms $\to$ Advanced Quantum*.
* Quick resume cards for **Quantum Entanglement** and **Grover's Search**.

### 4. 📚 Algorithms Library & Lessons (`/algorithms` & `/algorithms/:id`)
* Comprehensive curriculum covering Bell State, Grover's Search, Quantum Teleportation, Deutsch-Jozsa, and Shor's Factoring.
* Structured lessons: What You'll Learn, Dirac Bra-Ket state formulas, conceptual breakdowns, interactive circuit runners, and knowledge checks.

### 5. 🎯 Gamified Quantum Quiz (`/quiz`)
* Realistic multi-choice quantum questions with immediate feedback.
* Detailed physical explanations for correct and incorrect answers.
* Local storage persistence of quiz scores and student badges.

### 6. 📈 Progress & Analytics (`/progress`)
* Circular completion gauge (68%).
* Weekly study minutes and simulation counts chart (Recharts).
* Algorithm mastery progress bars.
* Adaptive AI learning recommendations.

### 7. 👤 Student Profile & Settings (`/profile`, `/settings`)
* Explorer rank title, streak records, earned achievement badges (*Quantum Beginner, Circuit Builder, Quiz Master*).
* Customizable study goals, difficulty levels, and simulator shot preferences.

---

## 🛠 Tech Stack

* **Frontend Framework**: React 18
* **Build Tool**: Vite 5
* **Styling**: Tailwind CSS 3 with custom quantum palette, glows, and glassmorphism
* **Visualizations**: Recharts & Pure SVG/Canvas 3D projections
* **Icons**: Lucide React
* **Notifications**: React Hot Toast
* **Language**: JavaScript (ES6+ / JSX)

---

## 🔒 Evaluation Note
This project operates **100% locally in the browser**. It does not require any external backend servers, databases, or third-party AI API keys to function during the hackathon demonstration.
