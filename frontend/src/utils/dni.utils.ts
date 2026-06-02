import { beneficiariesMock } from '../mocks/beneficiaries.mock'

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

export function normalizeDniText(text: string) {
  const normalized = text
    .toLowerCase()
    .replace(/[.,;:]/g, ' ')
    .split(/\s+/)
    .map((word) => numberWords[word] ?? word)
    .join(' ')

  return normalized
}

export function extractDniFromText(text: string) {
  const normalizedText = normalizeDniText(text)

  const joinedDigits = normalizedText.replace(/\D/g, '')

  if (joinedDigits.length >= 8) {
    return joinedDigits.slice(0, 8)
  }

  const dniMatch = normalizedText.match(/\b\d{8}\b/)

  return dniMatch?.[0] ?? null
}

export function findBeneficiaryByDni(dni: string) {
  return beneficiariesMock.find((beneficiary) => beneficiary.dni === dni) ?? null
}