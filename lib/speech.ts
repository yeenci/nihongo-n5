export function speakJapanese(text: string, voice?: SpeechSynthesisVoice) {
  if (!text.trim()) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  if (voice) {
    utterance.voice = voice;
  }

  speechSynthesis.speak(utterance);
}
