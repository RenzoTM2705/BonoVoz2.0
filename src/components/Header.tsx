import { Link, useLocation } from 'react-router-dom'
import { useState, useLayoutEffect, useRef } from 'react'
import logoSmall from '../assets/logo-small.svg'
import iconNotif from '../assets/icon-notif.svg'
import iconUser from '../assets/icon-user.svg'

export default function Header() {
  const location = useLocation()
  const [underlineStyle, setUnderlineStyle] = useState({})
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const activeIndex = location.pathname === '/voz' ? 1 : 0

  useLayoutEffect(() => {
    const updateUnderlinePosition = () => {
      const activeElement = navRefs.current[activeIndex]
      if (activeElement) {
        setUnderlineStyle({
          width: `${activeElement.offsetWidth}px`,
          left: `${activeElement.offsetLeft}px`,
        })
      }
    }

    updateUnderlinePosition()
    window.addEventListener('resize', updateUnderlinePosition)
    return () => window.removeEventListener('resize', updateUnderlinePosition)
  }, [activeIndex])

  const navItems = [
    { label: 'Inicio', to: '/' },
    { label: 'Voz', to: '/voz' }
  ]

  const mobileMenuItems = [
    { label: 'Inicio', to: '/', description: 'Pantalla principal' },
    { label: 'Voz', to: '/voz', description: 'Verificacion por voz' }
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm relative">
      <style>{`
        .nav-underline {
          position: absolute;
          bottom: -2px;
          height: 3px;
          background-color: rgb(15, 23, 42);
          transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${logoSmall})` }} />
          <span className="text-lg sm:text-xl font-bold text-slate-900">BonoVoz 2.0</span>
        </div>

        {/* Nav - Hidden on mobile */}
        <nav className="hidden md:flex gap-6 lg:gap-8 relative">
          {navItems.map((item, index) => (
            <Link
              key={item.to}
              ref={(el) => {
                navRefs.current[index] = el
              }}
              to={item.to}
              className={`text-sm font-semibold transition ${activeIndex === index ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              {item.label}
            </Link>
          ))}
          {/* Animated underline */}
          <span className="nav-underline" style={underlineStyle}></span>
          <a href="#bono" className="text-sm text-slate-600 hover:text-slate-900 transition">
            Mi Bono
          </a>
        </nav>

        {/* Desktop Icons */}
        <div className="hidden md:flex gap-2 sm:gap-3">
          <button className="p-2 hover:bg-slate-100 rounded-full transition cursor-pointer" aria-label="Notificaciones">
            <div className="w-5 h-5 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${iconNotif})` }} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full transition cursor-pointer" aria-label="Usuario">
            <div className="w-5 h-5 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${iconUser})` }} />
          </button>
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-full transition cursor-pointer" aria-label="Usuario">
            <div className="w-5 h-5 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${iconUser})` }} />
          </button>
          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Cerrar menu de navegacion' : 'Abrir menu de navegacion'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-sm font-semibold"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {isMobileMenuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
            <span>{isMobileMenuOpen ? 'Cerrar' : 'Menu'}</span>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-navigation" className="md:hidden absolute top-full left-0 right-0 border-t border-slate-200 bg-white shadow-xl">
          <nav className="px-4 py-4 space-y-2" aria-label="Navegacion principal movil">
            {mobileMenuItems.map((item) => {
              const isActive = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block rounded-xl border px-4 py-3 transition ${isActive
                      ? 'border-slate-900 bg-slate-100 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                    <span className="text-slate-400 text-lg" aria-hidden="true">&gt;</span>
                  </div>
                </Link>
              )
            })}

            <a
              href="#bono"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-4 py-3"
            >
              <p className="text-base font-semibold">Mi Bono</p>
              <p className="text-xs text-slate-500">Estado de beneficio</p>
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
