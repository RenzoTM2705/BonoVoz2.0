import { useState } from 'react'

interface AdminProps {
  onLogout: () => void
}

export default function Admin({ onLogout }: AdminProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen bg-slate-50">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-50 bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>

        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:relative w-64 bg-slate-900 text-white transition-transform duration-300 z-40 min-h-screen flex flex-col`}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold">BonoVoz 2.0</h2>
            <p className="text-slate-400 text-sm mt-1">Panel Administrativo</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {[
              { icon: '📊', label: 'Dashboard', active: true }
            ].map((item, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  item.active
                    ? 'bg-amber-500 text-slate-900 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Support & Logout */}
          <div className="p-4 border-t border-slate-700 space-y-2">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-colors text-sm cursor-pointer"
            >
              <span className="text-lg">🚪</span>
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {/* Metric Card 1 */}
              <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-2xl">👥</div>
                  <span className="text-green-600 text-xs sm:text-sm font-semibold">↑ 12%</span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm mb-2">Usuarios Registrados</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">2.4M</p>
              </div>

              {/* Metric Card 2 */}
              <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-lg text-2xl">✓</div>
                  <span className="text-green-600 text-xs sm:text-sm font-semibold">↑ 8.4%</span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm mb-2">Validaciones por Voz</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">1.8M</p>
              </div>

              {/* Metric Card 3 */}
              <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-red-100 p-3 rounded-lg text-2xl">⚠</div>
                  <span className="text-red-600 text-xs sm:text-sm font-semibold">↓ 0.5%</span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm mb-2">Errores Reconocimiento</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">2.4%</p>
              </div>

              {/* Metric Card 4 */}
              <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-amber-100 p-3 rounded-lg text-2xl">📈</div>
                  <span className="text-green-600 text-xs sm:text-sm font-semibold">↑ 15%</span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm mb-2">Bonos Entregados</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">S/ 1.2B</p>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-slate-200 mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-bold text-slate-900">Validaciones Diarias</h2>
                <button className="text-slate-600 hover:text-slate-900 text-sm font-medium">Ver detalle →</button>
              </div>

              {/* Placeholder Chart */}
              <div className="h-48 sm:h-64 bg-gradient-to-b from-slate-100 to-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                <div className="text-center">
                  <span className="text-4xl sm:text-5xl">📊</span>
                  <p className="text-slate-500 text-xs sm:text-sm mt-2">Grafico de validaciones diarias</p>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-4 mt-6">
                {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map((day) => (
                  <div key={day} className="text-center">
                    <p className="text-slate-600 text-xs sm:text-sm font-medium">{day}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 sm:p-6 mb-8">
              <div className="flex gap-3">
                <span className="text-2xl sm:text-3xl flex-shrink-0">ℹ️</span>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">Acceso Protegido</h3>
                  <p className="text-blue-700 text-xs sm:text-sm">
                    Este panel es exclusivo para administradores. Los datos mostrados se actualizan en tiempo real. 
                    Para mas informacion, contacta al equipo de soporte tecnico.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
