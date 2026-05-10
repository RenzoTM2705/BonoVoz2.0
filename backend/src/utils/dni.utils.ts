/**
 * Utilidades para procesamiento de DNI
 */

import { beneficiariesMock } from '../mocks/beneficiaries.mock.js'
import type { Beneficiary } from '../types/index.js'

const numberWords: Record<string, string> = {
  cero: '0',
  uno: '1',
  una: '1',
  dos: '2',
  tres: '3',
  cuatro: '4',
  cinco: '5',
  seis: '6',
  siete: '7',
  ocho: '8',
  nueve: '9',
}

/**
 * Normaliza texto de DNI, convirtiendo palabras numéricas a dígitos
 */
export function normalizeDniText(text: string): string {
  const normalized = text
    .toLowerCase()
    .replace(/[.,;:]/g, ' ')
    .split(/\s+/)
    .map((word) => numberWords[word] ?? word)
    .join(' ')

  return normalized
}

/**
 * Extrae DNI válido de 8 dígitos del texto
 * IMPORTANTE: Retorna el ÚLTIMO DNI encontrado para soportar correcciones
 * Ej: "Mi DNI es 1 2 3 4 5, no, mi DNI es 4 5 6 7 8 2 3 8" → retorna "45678238"
 */
export function extractDniFromText(text: string): string | null {
  const normalizedText = normalizeDniText(text)
  
  // Buscar grupos de dígitos separados por espacios/puntos
  // Ej: "1 2 3 4 5" o "45678238" o "4 5 6 7 8 2 3 8"
  const digitGroups = normalizedText.match(/\d+(\s+\d+)*/g)
  
  if (!digitGroups || digitGroups.length === 0) {
    return null
  }

  // Remover espacios dentro de cada grupo y filtrar solo los de 8 dígitos
  const allDnis = digitGroups
    .map(group => group.replace(/\s+/g, ''))
    .filter(group => group.length === 8)

  // Retornar el ÚLTIMO DNI encontrado (para correcciones)
  if (allDnis.length > 0) {
    return allDnis[allDnis.length - 1]
  }

  return null
}

/**
 * Busca un beneficiario por su DNI en la base de datos mock
 */
export function findBeneficiaryByDni(dni: string): Beneficiary | null {
  return beneficiariesMock.find((beneficiary) => beneficiary.dni === dni) ?? null
}

/**
 * Valida que un DNI tenga formato correcto (8 dígitos)
 */
export function isValidDniFormat(dni: string): boolean {
  return /^\d{8}$/.test(dni)
}
