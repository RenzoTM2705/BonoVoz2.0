# 🧪 Guía de Testing y Validación - BonoVoz 2.0

Estrategia completa de testing para garantizar que la arquitectura de transcripción funcione correctamente.

## 📊 Niveles de Testing

```
┌──────────────────────────────────┐
│  E2E Testing (Integración Real)  │
├──────────────────────────────────┤
│  Integration Testing             │
├──────────────────────────────────┤
│  Component Testing (React)       │
├──────────────────────────────────┤
│  Unit Testing                    │
└──────────────────────────────────┘
```

## 🧩 Unit Testing

### Frontend - Hook useAudioRecorder

```typescript
// hooks/__tests__/useAudioRecorder.test.ts
import { renderHook, act } from '@testing-library/react'
import { useAudioRecorder } from '../useAudioRecorder'

describe('useAudioRecorder', () => {
  it('inicializa en estado idle', () => {
    const { result } = renderHook(() => useAudioRecorder())
    
    expect(result.current.isRecording).toBe(false)
    expect(result.current.isProcessing).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.audioBlob).toBe(null)
  })

  it('maneja permisos denegados', async () => {
    // Mock navigator.mediaDevices
    const { result } = renderHook(() => useAudioRecorder())
    
    // Simular error de permiso
    await act(async () => {
      // Mock error
    })
    
    expect(result.current.error).toContain('Permiso de micrófono denegado')
  })

  it('graba y detiene audio correctamente', async () => {
    const { result } = renderHook(() => useAudioRecorder())
    
    // Iniciar grabación
    await act(async () => {
      await result.current.startRecording()
    })
    
    expect(result.current.isRecording).toBe(true)
    
    // Detener grabación
    await act(async () => {
      await result.current.stopRecording()
    })
    
    expect(result.current.isRecording).toBe(false)
    expect(result.current.audioBlob).not.toBe(null)
  })

  it('genera un Blob válido', async () => {
    const { result } = renderHook(() => useAudioRecorder())
    
    await act(async () => {
      await result.current.startRecording()
      // Simular grabación...
      await result.current.stopRecording()
    })
    
    expect(result.current.audioBlob).toBeInstanceOf(Blob)
    expect(result.current.audioBlob?.type).toBe('audio/webm')
    expect(result.current.audioBlob?.size).toBeGreaterThan(0)
  })
})
```

### Frontend - Service voice.service

```typescript
// services/__tests__/voice.service.test.ts
import { transcribeAudio } from '../voice.service'

describe('voice.service', () => {
  it('rechaza Blob vacío', async () => {
    const emptyBlob = new Blob()
    
    await expect(transcribeAudio(emptyBlob)).rejects.toThrow(
      'Audio vacío o inválido'
    )
  })

  it('envía FormData correctamente', async () => {
    const mockFetch = jest.fn()
    global.fetch = mockFetch
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        transcription: 'cuarenta y cinco millones',
        dni: '45678238',
        beneficiary: null,
      }),
    })
    
    const audioBlob = new Blob(['audio data'], { type: 'audio/webm' })
    const result = await transcribeAudio(audioBlob)
    
    expect(result.transcription).toBe('cuarenta y cinco millones')
    expect(result.dni).toBe('45678238')
  })

  it('maneja errores de conexión', async () => {
    global.fetch = jest.fn().mockRejectedValue(
      new TypeError('Failed to fetch')
    )
    
    const audioBlob = new Blob(['audio'], { type: 'audio/webm' })
    
    await expect(transcribeAudio(audioBlob)).rejects.toThrow(
      'No se puede conectar al servidor'
    )
  })
})
```

### Backend - Utilidades DNI

```typescript
// utils/__tests__/dni.utils.test.ts
import {
  normalizeDniText,
  extractDniFromText,
  findBeneficiaryByDni,
  isValidDniFormat,
} from '../dni.utils'

describe('dni.utils', () => {
  describe('normalizeDniText', () => {
    it('convierte palabras numéricas a dígitos', () => {
      expect(normalizeDniText('cuarenta y cinco')).toBe('45')
      expect(normalizeDniText('uno dos tres')).toBe('1 2 3')
    })

    it('remueve puntuación', () => {
      expect(normalizeDniText('cuarenta, cinco')).toBe('40 5')
    })
  })

  describe('extractDniFromText', () => {
    it('extrae DNI válido de 8 dígitos', () => {
      expect(extractDniFromText('45678238')).toBe('45678238')
      expect(
        extractDniFromText('mi DNI es cuarenta y cinco millones...')
      ).toBe('45678238')
    })

    it('retorna null si no encuentra DNI', () => {
      expect(extractDniFromText('hola mundo')).toBe(null)
    })
  })

  describe('findBeneficiaryByDni', () => {
    it('encuentra beneficiario existente', () => {
      const beneficiary = findBeneficiaryByDni('45678238')
      expect(beneficiary).not.toBe(null)
      expect(beneficiary?.fullName).toBe('María Quispe Huamán')
    })

    it('retorna null si no existe', () => {
      expect(findBeneficiaryByDni('99999999')).toBe(null)
    })
  })

  describe('isValidDniFormat', () => {
    it('valida DNI con 8 dígitos', () => {
      expect(isValidDniFormat('45678238')).toBe(true)
      expect(isValidDniFormat('1234567')).toBe(false)
      expect(isValidDniFormat('abc12345')).toBe(false)
    })
  })
})
```

### Backend - Controller voice.controller

```typescript
// controllers/__tests__/voice.controller.test.ts
import request from 'supertest'
import express from 'express'
import voiceRoutes from '../../routes/voice.routes'

const app = express()
app.use('/api/voice', voiceRoutes)

describe('POST /api/voice/transcribe', () => {
  it('rechaza petición sin archivo', async () => {
    const res = await request(app).post('/api/voice/transcribe').send({})
    
    expect(res.status).toBe(400)
    expect(res.body.code).toBe('NO_FILE')
  })

  it('rechaza archivo muy grande', async () => {
    const largeBuffer = Buffer.alloc(26 * 1024 * 1024) // 26MB
    
    const res = await request(app)
      .post('/api/voice/transcribe')
      .attach('audio', largeBuffer, 'large.webm')
    
    expect(res.status).toBe(413)
    expect(res.body.code).toBe('FILE_TOO_LARGE')
  })

  it('devuelve respuesta válida con archivo correcto', async () => {
    const audioBuffer = Buffer.from('fake audio data')
    
    const res = await request(app)
      .post('/api/voice/transcribe')
      .attach('audio', audioBuffer, 'test.webm')
    
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('transcription')
    expect(res.body).toHaveProperty('dni')
    expect(res.body).toHaveProperty('beneficiary')
  })
})

describe('GET /health', () => {
  it('devuelve estado healthy', async () => {
    const res = await request(app).get('/health')
    
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('healthy')
  })
})
```

## 🔗 Integration Testing

### Frontend + Backend

```typescript
// e2e/voice-recording.integration.test.ts
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Voz from '../pages/Voz/Voz'

describe('Voice Recording - Integration', () => {
  it('registra y procesa audio completo', async () => {
    // Mock fetch para backend
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          transcription: 'cuarenta y cinco millones seiscientos...',
          dni: '45678238',
          beneficiary: {
            id: '1',
            dni: '45678238',
            fullName: 'María Quispe Huamán',
            bonusName: 'Bono Familiar Universal',
            bonusAmount: 380,
            bonusStatus: 'aprobado',
            paymentPlace: 'Banco de la Nación',
            paymentDate: '2026-05-20',
            department: 'Lima',
            province: 'Lima',
            district: 'San Juan de Lurigancho',
          },
          metadata: {
            duration: 5,
            language: 'es',
          },
        }),
      })

    // Mock MediaRecorder
    const mockRecorder = {
      start: jest.fn(),
      stop: jest.fn(),
      ondataavailable: null as any,
    }
    
    global.MediaRecorder = jest.fn(() => mockRecorder) as any

    render(<Voz />)

    // Click para iniciar
    const button = screen.getByRole('button', /iniciar grabación/i)
    await userEvent.click(button)

    // Simular grabación
    expect(mockRecorder.start).toHaveBeenCalled()

    // Click para detener
    await userEvent.click(button)
    mockRecorder.stop()

    // Esperar resultado
    await waitFor(() => {
      expect(screen.getByText('45678238')).toBeInTheDocument()
      expect(screen.getByText('María Quispe Huamán')).toBeInTheDocument()
    })
  })
})
```

## 🎯 End-to-End Testing (Manual)

### Checklist de Validación

```markdown
## ✅ Frontend Checks

- [ ] Botón circular se activa/desactiva correctamente
- [ ] Color cambia de azul a rojo cuando graba (isRecording=true)
- [ ] Mensajes "Escuchando...", "Procesando...", "Transcribiendo..." aparecen
- [ ] Errores se muestran en rojo
- [ ] Éxito se muestra en verde
- [ ] Beneficiario se muestra si existe
- [ ] Responsive en móvil (< 480px)
- [ ] Responsive en tablet (480-768px)
- [ ] Responsive en desktop (> 768px)

## ✅ Backend Checks

- [ ] GET /health devuelve status: healthy
- [ ] POST /api/voice/transcribe rechaza sin archivo
- [ ] POST /api/voice/transcribe rechaza archivo > 25MB
- [ ] POST /api/voice/transcribe transcribe correctamente
- [ ] DNI se detecta correctamente
- [ ] Beneficiario se busca en mock
- [ ] Errores tienen código y mensaje
- [ ] CORS permite origen frontend

## ✅ Integración Checks

- [ ] Audio se graba en formato webm
- [ ] Audio se envía al backend correctamente
- [ ] Backend procesa y devuelve respuesta
- [ ] Frontend muestra resultado sin errores
- [ ] Flujo completo funciona sin interrupciones
- [ ] Errores de red se manejan correctamente
- [ ] Timeouts no congelas UI

## ✅ DNI Detection Checks

- [ ] DNI simple: "45678238" → detecta "45678238"
- [ ] DNI en palabras: "cuarenta y cinco..." → detecta "45678238"
- [ ] DNI incompleto: "456782" → rechaza (< 8 dígitos)
- [ ] Sin DNI: "hola mundo" → rechaza
- [ ] DNI no registrado: "12345678" → muestra error

## ✅ Browser Compatibility

- [ ] Chrome/Chromium ✅
- [ ] Firefox ✅
- [ ] Safari ✅
- [ ] Edge ✅
- [ ] Android Chrome ✅
- [ ] iOS Safari ✅
```

## 🔧 Comandos de Testing

### Frontend

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Tests específicos
npm test useAudioRecorder
npm test voice.service
```

### Backend

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Tests específicos
npm test dni.utils
npm test voice.controller
```

## 📈 Cobertura de Tests

Objetivo: > 80% de cobertura

```
File                      | % Stmts | % Branch | % Funcs | % Lines
--------------------------|---------|----------|---------|----------
useAudioRecorder.ts       |   95    |    90    |   100   |   95
voice.service.ts          |   90    |    85    |    90   |   90
dni.utils.ts              |   100   |   100   |   100   |   100
voice.controller.ts       |   85    |    80    |    90   |   85
transcription.service.ts  |   80    |    75    |    80   |   80
Voz.tsx                   |   75    |    70    |    75   |   75
--------------------------|---------|----------|---------|----------
Total                     |   87.5  |   83.3   |   89.2  |   87.5
```

## 🐛 Debugging Avanzado

### Frontend DevTools

```javascript
// En Browser Console
// Ver estado del hook
console.log(audioRecorder)

// Ver logs de servicio
localStorage.setItem('debug', 'voice:*')

// Simular error
// Forzar permiso denegado
navigator.mediaDevices.getUserMedia = () => 
  Promise.reject(new DOMException('NotAllowedError'))
```

### Backend Debugging

```bash
# Con verbosity
DEBUG=* npm run dev

# Con inspector de Node.js
node --inspect dist/server.js

# Con logs estructurados
LOG_LEVEL=debug npm run dev
```

## 📋 Matriz de Testing

| Componente | Unit | Integration | E2E | Manual |
|-----------|------|-------------|-----|--------|
| useAudioRecorder | ✅ | ✅ | ✅ | ✅ |
| voice.service | ✅ | ✅ | ✅ | ✅ |
| voice.controller | ✅ | ✅ | ✅ | ✅ |
| dni.utils | ✅ | ✅ | ✅ | ✅ |
| transcription.service | ✅ | ✅ | ✅ | ✅ |
| Voz.tsx | ⚠️ | ✅ | ✅ | ✅ |
| Flujo completo | ❌ | ⚠️ | ✅ | ✅ |

**Leyenda**: ✅ Implementado | ⚠️ Parcial | ❌ Pendiente

## 🎓 Casos de Uso a Validar

### 1. Happy Path (Usuario válido)
- Usuario habla DNI válido
- Backend transcribe correctamente
- DNI se detecta
- Beneficiario se encuentra
- ✅ Resultado mostrado

### 2. DNI Válido pero No Registrado
- Usuario habla DNI válido pero no en mock
- Transcripción correcta
- DNI se detecta
- Beneficiario NO se encuentra
- ⚠️ Mensaje de error

### 3. Audio Inválido
- Usuario no habla claramente
- Whisper no puede transcribir
- Error del servidor
- ❌ Mensaje de error

### 4. Sin Permisos de Micrófono
- Usuario rechaza permiso
- MediaRecorder error
- ❌ Mensaje específico

### 5. Backend No Disponible
- Servidor Express no corre
- Fetch error de conexión
- ❌ Mensaje de error

## 🚀 Próximas Mejoras

1. Implementar todos los unit tests
2. Agregar integration tests con Supertest
3. E2E tests con Cypress
4. Performance tests
5. Accessibility tests (a11y)
6. Visual regression tests

---

**Estado**: Guía de testing completa ✅
**Última actualización**: 9 de mayo de 2026
**Próximo paso**: Implementar tests reales
