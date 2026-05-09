import iconBiometryActive from '../../assets/icon-biometry-active.svg'
import iconSimulate from '../../assets/icon-simulate.svg'
import { Link } from 'react-router-dom'

export default function Verificacion() {
  return (
    <div className="w-full min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <main className="max-w-md mx-auto">
        <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <header className="bg-green-100 p-6 text-center">
            <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
              <img src={iconBiometryActive} alt="Identidad confirmada" className="w-10 h-10" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">Identidad Confirmada</h1>
            <p className="mt-1 text-sm text-slate-700">La validación biométrica de voz fue exitosa</p>
          </header>

          <div className="p-6 space-y-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 font-medium">Confianza de la IA</span>
                <span className="text-sm text-slate-600 font-medium">98%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div className="h-3 bg-green-500 rounded-full" style={{ width: '98%' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase text-slate-500 font-semibold">Beneficiario</p>
                <p className="text-sm font-semibold text-slate-900">Maria Fernanda Quispe</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 font-semibold">DNI detectado</p>
                <p className="text-sm font-semibold text-slate-900">45678912</p>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-lg p-4 flex items-center gap-4">
              <div className="bg-amber-300 rounded p-3">
                <img src={iconSimulate} alt="Bono" className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm">Bono Alimentario 2024</p>
                <p className="text-lg font-semibold">S/ 760.00</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link to="/bono" className="w-full block bg-slate-900 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-center">
                <span>Continuar a Mi Bono</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </Link>

              <Link to="/voz" className="w-full block bg-amber-300 text-amber-900 py-3 rounded-lg font-semibold text-center">Reintentar Validación</Link>
            </div>
          </div>
        </section>

        <div className="mt-6 bg-white p-4 rounded-lg border border-slate-200 text-slate-700 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="17" r="1"/></svg>
            </div>
            <div>
              <p>Esta confirmación es parte del programa de seguridad de identidad del Gobierno del Perú. Sus datos están protegidos por la Ley de Protección de Datos Personales.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
