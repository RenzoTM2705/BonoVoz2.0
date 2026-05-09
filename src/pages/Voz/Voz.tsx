import Footer from '../../components/Footer'
import iconReniec from '../../assets/icon-reniec.svg'
import iconSunat from '../../assets/icon-sunat.svg'
import iconHelp from '../../assets/icon-help.svg'
import iconBiometryActive from '../../assets/icon-biometry-active.svg'

import { useState } from 'react'

import type { Beneficiary } from '../../types/beneficiary.types'

import {
    extractDniFromText,
    findBeneficiaryByDni,
} from '../../utils/dni.utils'

type SpeechRecognitionEvent = Event & {
    results: SpeechRecognitionResultList
}

type SpeechRecognitionErrorEvent = Event & {
    error: string
}

type SpeechRecognitionConstructor = new () => SpeechRecognition

type SpeechRecognition = {
    lang: string
    continuous: boolean
    interimResults: boolean
    start: () => void
    stop: () => void
    onstart: (() => void) | null
    onend: (() => void) | null
    onresult: ((event: SpeechRecognitionEvent) => void) | null
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
}

declare global {
    interface Window {
        SpeechRecognition?: SpeechRecognitionConstructor
        webkitSpeechRecognition?: SpeechRecognitionConstructor
    }
}


export default function Voz() {

    const [text, setText] = useState('')
    const [detectedDni, setDetectedDni] = useState<string | null>(null)
    const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isListening, setIsListening] = useState(false)

    function validateText(transcription: string) {
        setError('')
        setSuccessMessage('')
        setBeneficiary(null)

        const dni = extractDniFromText(transcription)

        if (!dni) {
            setDetectedDni(null)
            setError('No se detectó un DNI válido de 8 dígitos.')
            return
        }

        setDetectedDni(dni)

        const result = findBeneficiaryByDni(dni)

        if (!result) {
            setError('El DNI detectado no está registrado.')
            return
        }

        setBeneficiary(result)
        setSuccessMessage('DNI validado correctamente.')
    }

    function handleStartSpeech() {
        const SpeechRecognitionApi =
            window.SpeechRecognition || window.webkitSpeechRecognition

        if (!SpeechRecognitionApi) {
            setError('Tu navegador no soporta reconocimiento de voz. Usa Google Chrome o Microsoft Edge.')
            return
        }

        const recognition = new SpeechRecognitionApi()

        recognition.lang = 'es-PE'
        recognition.continuous = true
        recognition.interimResults = true

        recognition.onstart = () => {
            setIsListening(true)
            setError('')
            setText('')
            setDetectedDni(null)
            setBeneficiary(null)
        }

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join(' ')

            setText(transcript)

            const dni = extractDniFromText(transcript)

            if (dni) {
                recognition.stop()
                validateText(transcript)
            }
        }

        recognition.onerror = (event) => {
            console.log('Speech recognition error:', event.error)

            if (event.error === 'not-allowed') {
                setError('Permiso de micrófono denegado. Actívalo en la barra del navegador.')
            } else if (event.error === 'no-speech') {
                setError('No se detectó voz. Intenta hablar más cerca del micrófono.')
            } else if (event.error === 'audio-capture') {
                setError('No se encontró micrófono disponible.')
            } else {
                setError(`Error de reconocimiento de voz: ${event.error}`)
            }

            setIsListening(false)
        }

        recognition.onend = () => {
            setIsListening(false)
        }

        recognition.start()
    }
    return (
        <div className="w-full min-h-screen bg-slate-50">
            <style>{`
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(15, 23, 42, 0.7);
          }
          70% {
            box-shadow: 0 0 0 30px rgba(15, 23, 42, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(15, 23, 42, 0);
          }
        }
        .pulse-ring {
          animation: pulse-ring 2s infinite !important;
        }
        @keyframes wave-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .wave-float {
          animation: wave-float 4s ease-in-out infinite;
        }
      `}</style>
            <main className="min-h-screen flex flex-col">
                {/* Hero Section */}
                <section className="flex-1 w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Title */}
                        <div className="space-y-2 text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
                                Presione el botón y diga su DNI
                            </h1>
                            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                                Su identidad es validada mediante biometría de voz para su seguridad.
                            </p>
                        </div>

                        {/* Main Grid Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 items-center md:items-start">
                            {/* Left: Status Cards */}
                            <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
                                {/* RENIEC Card */}
                                <div className="p-4 sm:p-5 bg-white rounded-xl border-l-4 border-l-green-400 shadow-sm hover:shadow-md transition">
                                    <div className="flex gap-3 items-center">
                                        <img src={iconReniec} alt="RENIEC" className="w-5 h-5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider">RENIEC</p>
                                            <p className="text-sm sm:text-base font-semibold text-slate-900">Conectado</p>
                                        </div>
                                    </div>
                                </div>

                                {/* SUNAT Card */}
                                <div className="p-4 sm:p-5 bg-white rounded-xl border-l-4 border-l-green-400 shadow-sm hover:shadow-md transition">
                                    <div className="flex gap-3 items-center">
                                        <img src={iconSunat} alt="SUNAT" className="w-5 h-5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider">SUNAT</p>
                                            <p className="text-sm sm:text-base font-semibold text-slate-900">En línea</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Center: Voice Recording Circle */}
                            <div className="flex flex-col items-center gap-8 sm:gap-10">
                                {/* Main button circle with pulse animation */}
                                <button
                                    type="button"
                                    onClick={handleStartSpeech}
                                    className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full border-8 border-slate-200 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg flex-shrink-0 ${isListening ? 'pulse-ring bg-blue-700' : 'bg-slate-900'
                                        }`}
                                    aria-label="Iniciar grabación de voz"
                                >
                                    <svg
                                        className="w-16 h-16 sm:w-20 sm:h-20 text-white"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M12 14c-4 0-6 2-6 4v4h12v-4c0-2-2-4-6-4z" />
                                    </svg>
                                </button>

                                {/* Audio waveform visualization */}
                                <div className="flex gap-2 justify-center">
                                    <div className="w-1 h-2 bg-blue-600 rounded-full"></div>
                                    <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                                    <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                                    <div className="w-1 h-2 bg-blue-600 rounded-full"></div>
                                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                                    <div className="w-1 h-2 bg-blue-600 rounded-full"></div>
                                    <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                                    <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                                </div>
                                {/* MOCK DNI INPUT */}
                                <div className="w-full max-w-md space-y-4">
                                    <p className="text-center text-sm font-semibold text-slate-600">
                                        {isListening ? 'Escuchando... diga su DNI completo' : 'Presione el botón una vez para iniciar'}
                                    </p>

                                    {text && (
                                        <div className="rounded-xl bg-white p-4 text-sm text-slate-700 shadow-sm">
                                            <strong>Texto detectado:</strong> {text}
                                        </div>
                                    )}

                                    {detectedDni && (
                                        <div className="rounded-xl bg-blue-50 p-4">
                                            <p className="text-sm font-medium text-slate-600">DNI detectado</p>
                                            <strong className="text-lg text-slate-900">{detectedDni}</strong>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="rounded-xl bg-red-100 p-4 text-sm font-semibold text-red-700">
                                            {error}
                                        </div>
                                    )}
                                    {successMessage && (
                                        <div className="rounded-xl bg-green-100 p-4 text-sm font-semibold text-green-700">
                                            {successMessage}
                                        </div>
                                    )}
                                    {beneficiary && (
                                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
                                            <p className="text-sm text-slate-500">Beneficiario encontrado</p>

                                            <h3 className="text-xl font-bold text-slate-900">
                                                {beneficiary.fullName}
                                            </h3>

                                            <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-2">
                                                <p><strong>DNI:</strong> {beneficiary.dni}</p>
                                                <p><strong>Bono:</strong> {beneficiary.bonusName}</p>
                                                <p><strong>Monto:</strong> S/ {beneficiary.bonusAmount}</p>
                                                <p><strong>Estado:</strong> {beneficiary.bonusStatus}</p>
                                                <p><strong>Lugar:</strong> {beneficiary.paymentPlace}</p>
                                                <p><strong>Fecha:</strong> {beneficiary.paymentDate}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right: Help Card */}
                                <div className="flex flex-col gap-3 sm:gap-4">
                                    {/* Help Card */}
                                    <div className="p-4 sm:p-5 bg-amber-50 rounded-xl shadow-sm hover:shadow-md transition">
                                        <div className="flex gap-3 items-start">
                                            <img src={iconHelp} alt="Ayuda" className="w-5 h-5 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="text-sm sm:text-base font-semibold text-amber-900 mb-1">¿Necesita ayuda?</p>
                                                <p className="text-sm text-amber-800 leading-relaxed">
                                                    Hable de forma clara y pausada frente a su dispositivo.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Biometry Active Badge */}
                                    <div className="p-3 sm:p-4 bg-slate-100 rounded-lg border border-slate-200 flex gap-3 items-center">
                                        <img src={iconBiometryActive} alt="Biometría Activa" className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-sm sm:text-base font-bold text-slate-900">Biometría Activa</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom Banner */}
                <section className="w-full bg-slate-50 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                    <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden">
                        {/* Dynamic gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-95"></div>

                        {/* Animated blur shapes */}
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 wave-float"></div>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-slate-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 wave-float" style={{ animationDelay: '2s' }}></div>

                        {/* Content */}
                        <div className="relative z-10 px-6 sm:px-8 md:px-10 py-10 sm:py-12 md:py-14 text-center">
                            <p className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-relaxed">
                                Tecnología al servicio de cada peruano y peruana.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
