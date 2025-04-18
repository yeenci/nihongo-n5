export function speakJapanese(text: string, voice?: SpeechSynthesisVoice) {
  if (!text.trim()) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 1.0;
  utterance.rate = 0.8;
  utterance.pitch = 0.6;
  
  utterance.volume = 1;
  // utterance.rate = 0.6;
  // utterance.pitch = 1;

  if (voice) {
    utterance.voice = voice;
  }

  speechSynthesis.speak(utterance);
}
