// voz.js
// =========================================
// TTS X - Lector de Texto y PDF Avanzado
// =========================================

const synth = window.speechSynthesis;
const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const clearBtn = document.getElementById('clear-btn');
const pdfInput = document.getElementById('pdf-input');
const pdfInfo = document.getElementById('pdf-info');
const status = document.getElementById('status');
const wordCount = document.getElementById('word-count');
const charCount = document.getElementById('char-count');
const rateControl = document.getElementById('rate-control');
const pitchControl = document.getElementById('pitch-control');
const rateValue = document.getElementById('rate-value');
const pitchValue = document.getElementById('pitch-value');

let voices = [];
let currentUtterance = null;
let paused = false;

// ==========================
// 1. Cargar voces
// ==========================
function loadVoices() {
  voices = synth.getVoices();
  voiceSelect.innerHTML = '';

  if (voices.length === 0) {
    updateStatus('⚠️ No se encontraron voces. Esperando...');
    return;
  }

  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });

  document.getElementById('voices-count').textContent = voices.length;
  updateStatus('✅ Voces cargadas correctamente');
}

window.speechSynthesis.onvoiceschanged = loadVoices;

// ==========================
// 2. Actualizar estadísticas y habilitar botones
// ==========================
function updateStats() {
  const text = textInput.value.trim();
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  wordCount.textContent = words;
  charCount.textContent = text.length;

  // Activar o desactivar botones según el contenido
  playBtn.disabled = text.length === 0;
  clearBtn.disabled = text.length === 0;
}

textInput.addEventListener('input', updateStats);

// ==========================
// 3. Reproducir texto
// ==========================
function playText() {
  const text = textInput.value.trim();
  if (!text) return alert('Escribe o carga algo primero, pana.');

  if (paused && currentUtterance) {
    synth.resume();
    paused = false;
    updateStatus('▶️ Reanudado');
    return;
  }

  stopText(); // detener si hay algo en curso
  currentUtterance = new SpeechSynthesisUtterance(text);

  const selectedVoice = voices[voiceSelect.value];
  if (selectedVoice) currentUtterance.voice = selectedVoice;

  currentUtterance.rate = parseFloat(rateControl.value);
  currentUtterance.pitch = parseFloat(pitchControl.value);

  currentUtterance.onstart = () => updateStatus('🗣️ Reproduciendo...');
  currentUtterance.onend = () => {
    updateStatus('✅ Finalizado');
    toggleButtons(false);
  };
  currentUtterance.onerror = () => updateStatus('❌ Error al reproducir');

  synth.speak(currentUtterance);
  toggleButtons(true);
}

function pauseText() {
  if (synth.speaking && !paused) {
    synth.pause();
    paused = true;
    updateStatus('⏸️ Pausado');
  }
}

function stopText() {
  synth.cancel();
  currentUtterance = null;
  paused = false;
  toggleButtons(false);
  updateStatus('🛑 Detenido');
}

function clearText() {
  stopText();
  textInput.value = '';
  updateStats();
  updateStatus('🧹 Limpieza completada');
}

// ==========================
// 4. Controladores UI
// ==========================
playBtn.addEventListener('click', playText);
pauseBtn.addEventListener('click', pauseText);
stopBtn.addEventListener('click', stopText);
clearBtn.addEventListener('click', clearText);

rateControl.addEventListener('input', () => {
  rateValue.textContent = `${rateControl.value}x`;
});
pitchControl.addEventListener('input', () => {
  pitchValue.textContent = pitchControl.value;
});

// ==========================
// 5. Leer archivos PDF o TXT
// ==========================
pdfInput.addEventListener('change', handleFile);

async function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const fileName = file.name;
  const ext = fileName.split('.').pop().toLowerCase();

  if (ext === 'txt') {
    const text = await file.text();
    textInput.value = text;
    updateStats();
    updateStatus(`📄 Archivo TXT cargado: ${fileName}`);
  } else if (ext === 'pdf') {
    readPDF(file);
  } else {
    alert('Solo se aceptan archivos .pdf o .txt');
  }
}

async function readPDF(file) {
  updateStatus('📚 Leyendo PDF...');
  const pdfData = new Uint8Array(await file.arrayBuffer());
  const pdfDoc = await pdfjsLib.getDocument(pdfData).promise;
  let textContent = '';

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const text = await page.getTextContent();
    textContent += text.items.map(t => t.str).join(' ') + '\n';
  }

  textInput.value = textContent.trim();
  updateStats();
  updateStatus(`✅ PDF cargado (${pdfDoc.numPages} páginas)`);
}

// ==========================
// 6. Utilidades
// ==========================
function updateStatus(msg) {
  status.textContent = msg;
}

function toggleButtons(playing) {
  playBtn.disabled = playing;
  pauseBtn.disabled = !playing;
  stopBtn.disabled = !playing;
}

// Activar botones al inicio si hay texto preexistente
document.addEventListener('DOMContentLoaded', () => {
  loadVoices();
  updateStats();
});
