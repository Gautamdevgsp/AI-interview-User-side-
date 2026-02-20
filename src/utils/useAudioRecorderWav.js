import { useRef } from "react";

export default function useAudioRecorderWav() {
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);
  const audioDataRef = useRef([]);

  const startRecording = async () => {
    streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioContextRef.current = new AudioContext({ sampleRate: 44100 });
    const source = audioContextRef.current.createMediaStreamSource(streamRef.current);

    processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

    processorRef.current.onaudioprocess = (e) => {
      audioDataRef.current.push(new Float32Array(e.inputBuffer.getChannelData(0)));
    };

    source.connect(processorRef.current);
    processorRef.current.connect(audioContextRef.current.destination);
  };

  const stopRecording = async () => {
    processorRef.current.disconnect();
    audioContextRef.current.close();
    streamRef.current.getTracks().forEach(track => track.stop());

    const wavBlob = encodeWAV(audioDataRef.current, 44100);
    audioDataRef.current = [];

    return wavBlob;
  };

  return { startRecording, stopRecording };
}

/* ---------- WAV ENCODER ---------- */
function encodeWAV(buffers, sampleRate) {
  const length = buffers.reduce((acc, b) => acc + b.length, 0);
  const buffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + length * 2, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, length * 2, true);

  let offset = 44;
  buffers.forEach(b => {
    for (let i = 0; i < b.length; i++) {
      const s = Math.max(-1, Math.min(1, b[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
  });

  return new Blob([view], { type: "audio/wav" });
}

function writeString(view, offset, str) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
