import supabase from '../config/supabase.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'change_me'

export interface AdminUser {
  id: string
  email: string
  role: string
}

export async function createAdminIfNotExists(email: string, plainPassword: string) {
  try {
    const { data: existing, error: errExisting } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .limit(1)
      .single()

    if (errExisting) {
      // if not found, continue to create
    }
    if (existing) return existing

    const hashed = bcrypt.hashSync(plainPassword, 10)
    const { data, error } = await supabase.from('admin_users').insert([{ email, password_hash: hashed, role: 'admin' }])
    if (error) {
      console.error('[SUPABASE] createAdmin error:', error.message)
      return null
    }

    return data?.[0] ?? null
  } catch (err) {
    console.error('[SUPABASE] createAdmin unexpected error', err)
    return null
  }
}

export async function authenticateAdmin(email: string, password: string) {
  const { data, error } = await supabase.from('admin_users').select('*').eq('email', email).limit(1).single()
  if (error || !data) return null

  const match = bcrypt.compareSync(password, data.password_hash)
  if (!match) return null

  const token = jwt.sign({ sub: data.id, email: data.email, role: data.role }, JWT_SECRET, { expiresIn: '8h' })

  return {
    token,
    user: {
      email: data.email,
      role: data.role,
    },
  }
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded as any
  } catch (err) {
    return null
  }
}
