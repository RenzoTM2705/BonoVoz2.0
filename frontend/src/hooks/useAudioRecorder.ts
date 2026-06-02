import { useState, useRef, useCallback } from 'react'

export function useAudioRecorder(onAudioChunk?: (chunk: Blob) => void) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState('')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const startRecording = useCallback(async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4'

      const mediaRecorder = new MediaRecorder(stream, { mimeType })

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data)
        // Enviar chunk en tiempo real si hay callback
        if (event.data.size > 0 && onAudioChunk) {
          onAudioChunk(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        chunksRef.current = []
        stream.getTracks().forEach((track) => track.stop())
        setIsRecording(false)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(100) // Capturar chunks cada 100ms
      setIsRecording(true)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al acceder al micrófono'
      setError(errorMsg)
      setIsRecording(false)
    }
  }, [onAudioChunk])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const resetRecorder = useCallback(() => {
    setAudioBlob(null)
    setError('')
    setIsProcessing(false)
  }, [])

  return {
    startRecording,
    stopRecording,
    audioBlob,
    isRecording,
    isProcessing,
    error,
    resetRecorder,
  }
}
