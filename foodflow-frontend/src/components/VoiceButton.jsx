import { useSpeechRecognition } from '../hooks/useSpeechRecognition'

function VoiceButton({ onResult, title = 'Voice input' }) {
  const { start, listening, supported } = useSpeechRecognition({ onResult })

  // Gracefully disappears on browsers without SpeechRecognition support (e.g. Firefox)
  // instead of showing a button that does nothing when clicked.
  if (!supported) return null

  return (
    <button
      type="button"
      onClick={start}
      title={title}
      aria-label={title}
      className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200 flex-shrink-0 ${
        listening ? 'animate-pulse' : 'hover:scale-105 active:scale-95'
      }`}
      style={
        listening
          ? { background: 'rgba(248,113,113,0.15)', borderColor: 'rgba(248,113,113,0.4)', color: '#f87171' }
          : { background: 'rgba(34,211,238,0.08)', borderColor: 'rgba(34,211,238,0.25)', color: '#22d3ee' }
      }
    >
      {listening ? '●' : '🎤'}
    </button>
  )
}

export default VoiceButton
