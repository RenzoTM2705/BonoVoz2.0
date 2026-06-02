# BonoVoz 2.0

Sistema web inteligente de validación de identidad mediante biometría de voz y asistencia conversacional con inteligencia artificial.

---

# Descripción del Proyecto

BonoVoz 2.0 es una plataforma desarrollada para modernizar el proceso de validación de beneficiarios utilizando tecnologías de reconocimiento de voz e inteligencia artificial.

El sistema permite que un usuario diga su DNI usando el micrófono de su dispositivo. Posteriormente, el audio es procesado mediante servicios de transcripción y validación para identificar automáticamente al beneficiario.

Además, la plataforma incorpora un chatbot inteligente capaz de responder preguntas y asistir al usuario en tiempo real.

---

# Objetivos del Proyecto

- Implementar biometría de voz para validación de identidad.
- Automatizar procesos de consulta de beneficiarios.
- Integrar inteligencia artificial conversacional.
- Mejorar accesibilidad y experiencia del usuario.
- Aplicar arquitectura web moderna basada en React y Node.js.

---

# Tecnologías Utilizadas

## Frontend

| Herramienta | Uso |
|---|---|
| React | Desarrollo de interfaz |
| TypeScript | Tipado estático |
| Vite | Build Tool |
| TailwindCSS | Diseño UI |
| React Router | Navegación SPA |

---

## Backend

| Herramienta | Uso |
|---|---|
| Node.js | Runtime backend |
| Express | API REST |
| JavaScript | Lógica backend |
| Multer | Manejo de archivos |

---

## Base de Datos

| Herramienta | Tipo |
|---|---|
| Supabase | Backend as a Service |
| PostgreSQL | Base de datos relacional |

---

## APIs e Inteligencia Artificial

| Herramienta | Uso |
|---|---|
| Deepgram API | Transcripción de voz |
| OpenAI API | Chatbot inteligente |
| Fetch API | Consumo de APIs |

---

# Funcionalidades Principales

## Biometría de Voz

- Captura de audio desde el navegador.
- Grabación mediante MediaRecorder API.
- Transcripción automática del audio.
- Detección automática de DNI.
- Validación de beneficiarios.

---

## Chatbot Inteligente

- Asistencia conversacional.
- Respuestas automáticas.
- Orientación al usuario.
- Integración con IA.

---

## Interfaz Moderna

- Diseño responsive.
- Animaciones de audio.
- Experiencia intuitiva.
- Navegación dinámica.

---

# Arquitectura General

```txt
Frontend (React + TypeScript)
        │
        ▼
API REST (Express + Node.js)
        │
 ┌──────┴──────┐
 ▼             ▼
Deepgram     OpenAI
(Voz)        (Chatbot)
        │
        ▼
Supabase / PostgreSQL
```

---

# Flujo del Sistema

1. El usuario accede a la vista de Voz.
2. El sistema solicita permisos del micrófono.
3. El usuario dice su DNI.
4. El audio se envía al backend.
5. Deepgram transcribe el contenido.
6. El sistema detecta el DNI.
7. Se valida el beneficiario.
8. El usuario accede a la verificación.
9. El chatbot puede asistir durante el proceso.

---

# Componentes Importantes

| Componente | Función |
|---|---|
| Vista de Voz | Captura y procesamiento de audio |
| Chatbot Inteligente | Asistencia conversacional |
| Validación DNI | Identificación de beneficiarios |
| Biometría de Voz | Verificación mediante audio |
| Sistema de Navegación | Flujo entre vistas |

---

# Características Técnicas

- Arquitectura modular.
- Comunicación REST.
- Manejo de estados con React Hooks.
- Captura de audio en tiempo real.
- Integración con APIs externas.
- Diseño responsive.
- Inteligencia artificial aplicada.

