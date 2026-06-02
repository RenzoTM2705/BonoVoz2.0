import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Beneficiary } from '../types/beneficiary.types'

interface UserContextType {
  verifiedBeneficiary: Beneficiary | null
  setVerifiedBeneficiary: (beneficiary: Beneficiary | null) => void
  isVerified: boolean
  clearVerification: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [verifiedBeneficiary, setVerifiedBeneficiary] = useState<Beneficiary | null>(null)

  const isVerified = verifiedBeneficiary !== null

  const clearVerification = () => {
    setVerifiedBeneficiary(null)
  }

  return (
    <UserContext.Provider
      value={{
        verifiedBeneficiary,
        setVerifiedBeneficiary,
        isVerified,
        clearVerification,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
