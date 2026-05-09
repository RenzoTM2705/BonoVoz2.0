import logoSmall from '../assets/logo-small.svg'
import iconNotif from '../assets/icon-notif.svg'
import iconUser from '../assets/icon-user.svg'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${logoSmall})` }} />
          <span className="text-lg sm:text-xl font-bold text-slate-900">BonoVoz 2.0</span>
        </div>

        {/* Nav - Hidden on mobile */}
        <nav className="hidden md:flex gap-6 lg:gap-8">
          <a href="#inicio" className="text-sm font-semibold text-slate-900 border-b-2 border-slate-900">
            Inicio
          </a>
          <a href="#voz" className="text-sm text-slate-600 hover:text-slate-900 transition">
            Voz
          </a>
          <a href="#seguridad" className="text-sm text-slate-600 hover:text-slate-900 transition">
            Seguridad
          </a>
          <a href="#bono" className="text-sm text-slate-600 hover:text-slate-900 transition">
            Mi Bono
          </a>
        </nav>

        {/* Icons */}
        <div className="flex gap-2 sm:gap-3">
          <button className="p-2 hover:bg-slate-100 rounded-full transition cursor-pointer" aria-label="Notificaciones">
            <div className="w-5 h-5 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${iconNotif})` }} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full transition cursor-pointer" aria-label="Usuario">
            <div className="w-5 h-5 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${iconUser})` }} />
          </button>
        </div>
      </div>
    </header>
  )
}
