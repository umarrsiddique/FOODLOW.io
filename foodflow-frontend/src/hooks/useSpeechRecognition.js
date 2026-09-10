import { useCallback, useRef, useState } from 'react'

// Wraps the browser's SpeechRecognition API. Not every browser supports it
// (Firefox notably doesn't) - `supported` lets callers hide the mic button gracefully
// instead of throwing when someone clicks it.
export function useSpeechRecognition({ onResult } = {}) {
  const [listening, setListening] = useState(false)
  const [supported] = useState(
    () => typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  )
  const recognitionRef = useRef(null)

  const start = useCallback(() => {
    if (!supported || listening) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onResult?.(transcript)
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }, [supported, listening, onResult])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  return { start, stop, listening, supported }
}
