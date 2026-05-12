import { useState } from 'react'

interface AdminLoginProps {
  onLogin: (authenticated: boolean) => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (email === 'adminbono@gmail.com' && password === 'admin27') {
      localStorage.setItem('adminAuthenticated', 'true')
      onLogin(true)
    } else {
      setError('Credenciales inválidas. Verifica tu email y contraseña.')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md">
        {/* Logo section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="text-5xl">🔐</div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">BonoVoz 2.0</h1>
          <p className="text-amber-500 font-semibold">Panel Administrativo</p>
        </div>

        {/* Login card */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-8">Acceso Restringido</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email input */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                <span className="mr-1">✉️</span>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correoadmin@gmail.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Password input */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                <span className="mr-1">🔑</span>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-900/30 border border-red-500/50 flex items-start gap-3">
                <span className="text-xl flex-shrink-0">⚠️</span>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-900 font-bold py-3 rounded-lg transition-all shadow-lg cursor-pointer"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Info box */}
          <div className="mt-8 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
            <p className="text-blue-300 text-xs">
              <span className="font-semibold">ℹ️ Nota:</span> Este es un panel administrativo. Solo personas autorizadas pueden acceder.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>© 2026 Gobierno del Perú - Plataforma BonoVoz</p>
        </div>
      </div>
    </div>
  )
}
