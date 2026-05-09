import logoSmall from '../assets/logo-small.svg'

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-white py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Logo & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${logoSmall})` }} />
            <span className="text-sm font-semibold">BonoVoz 2.0</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 text-center sm:text-right">
            © 2026 Gobierno del Perú - Plataforma de Subsidios BonoVoz.
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <a href="#" className="text-xs sm:text-sm text-slate-300 hover:text-white transition cursor-pointer">
            Términos y Condiciones
          </a>
          <a href="#" className="text-xs sm:text-sm text-slate-300 hover:text-white transition cursor-pointer">
            Privacidad
          </a>
          <a href="#" className="text-xs sm:text-sm text-slate-300 hover:text-white transition cursor-pointer">
            Contacto
          </a>
          <a href="#" className="text-xs sm:text-sm text-slate-300 hover:text-white transition cursor-pointer">
            Soporte
          </a>
        </div>
      </div>
    </footer>
  )
}
