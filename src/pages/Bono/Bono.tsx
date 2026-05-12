import Footer from '../../components/Footer'
import iconSeal from '../../assets/icon-seal.svg'
import iconConsult from '../../assets/icon-consult.svg'
import iconSimulate from '../../assets/icon-simulate.svg'
import iconInfo from '../../assets/icon-info.svg'
import iconFab from '../../assets/icon-fab.svg'
import { Link } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'

export default function Bono() {
  const { verifiedBeneficiary, isVerified } = useUser()

  // Si no está verificado, mostrar mensaje de registro
  if (!isVerified || !verifiedBeneficiary) {
    return (
      <div className="w-full min-h-screen bg-slate-50">
        <main className="w-full py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <section className="space-y-8">
              {/* Empty State */}
              <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-6">
                  <span className="text-4xl">🔐</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-3">Primero debes verificarte</h1>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  Para ver tu información de bonos, necesitas registrarte dictando tu DNI en la sección "Voz".
                </p>
                <Link
                  to="/voz"
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
                >
                  <span>Ir a Registrarme por Voz</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </Link>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">ℹ️</span>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">¿Cómo funciona?</h3>
                    <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
                      <li>Dirígete a la sección "Voz"</li>
                      <li>Presiona el botón y di tu DNI completo</li>
                      <li>Espera la validación de tu identidad</li>
                      <li>Luego verás tus datos de bonos aquí</li>
                    </ol>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Si está verificado, mostrar datos del beneficiario
  return (
    <div className="w-full min-h-screen bg-slate-50">
      <main className="w-full py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10 md:space-y-12">
          <section className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">Hola, {verifiedBeneficiary.fullName.split(' ')[0]}</h1>
            <p className="text-base sm:text-lg text-slate-600">Aqui tienes el resumen de tu subsidio actual.</p>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <article className="bg-white rounded-2xl border-l-8 border-amber-600 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-bold tracking-wider text-amber-800 uppercase">Monto disponible</p>
                    <p className="text-4xl sm:text-5xl font-bold text-slate-900">S/ {verifiedBeneficiary.bonusAmount}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-lg bg-green-900 px-3 py-1.5">
                    <img src={iconSeal} alt="Estado aprobado" className="w-4 h-4" />
                    <span className="text-green-300 text-sm font-semibold">{verifiedBeneficiary.bonusStatus}</span>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-200 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <img src={iconInfo} alt="Fecha de cobro" className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Fecha de cobro</p>
                      <p className="text-base font-bold text-slate-900">{verifiedBeneficiary.paymentDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <img src={iconConsult} alt="Tipo de bono" className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Tipo de bono</p>
                      <p className="text-base font-semibold text-slate-900">{verifiedBeneficiary.bonusName}</p>
                    </div>
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Punto de cobro mas cercano</h2>
                  <div className="inline-flex items-center gap-2 text-slate-700">
                    <img src={iconSimulate} alt="Distancia" className="w-5 h-5" />
                    <span className="text-sm font-semibold">850 metros</span>
                  </div>
                </div>

                <div className="h-52 sm:h-64 rounded-xl overflow-hidden relative bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200">
                  <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_30%,#1e3a8a_0,transparent_40%),radial-gradient(circle_at_75%_60%,#0f172a_0,transparent_42%)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-lg">
                      <img src={iconFab} alt="Marcador de mapa" className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-base sm:text-lg font-semibold text-slate-900">{verifiedBeneficiary.paymentPlace}</p>
                    <p className="text-sm sm:text-base text-slate-600">Av. Javier Prado Este 2465, San Borja</p>
                  </div>
                  <button className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-semibold hover:bg-slate-800 transition cursor-pointer">
                    <img src={iconConsult} alt="Como llegar" className="w-5 h-5" />
                    Como llegar
                  </button>
                </div>
              </article>
            </div>

            <aside className="space-y-6">
              <article className="bg-blue-800 text-white rounded-2xl shadow-sm p-6 sm:p-7 space-y-4">
                <h3 className="text-xl font-semibold">Tu ahorro BonoVoz</h3>
                <p className="text-blue-100">Al cobrar en este punto cercano, estas ahorrando en movilidad:</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-bold">S/ 12.50</span>
                  <span className="text-sm text-blue-100">estimados</span>
                </div>
                <p className="text-xs sm:text-sm text-blue-100 border-t border-blue-500 pt-4">Calculado segun tarifa promedio de transporte local.</p>
              </article>

              <article className="bg-amber-300 rounded-2xl border border-amber-700/20 p-6 sm:p-7 space-y-4">
                <div className="inline-flex items-center gap-2 text-amber-900 font-bold text-sm uppercase tracking-wide">
                  <img src={iconFab} alt="Asistencia por voz" className="w-5 h-5" />
                  Asistencia por voz
                </div>
                <p className="text-amber-900 text-base">Prefieres escuchar las instrucciones para tu cobro?</p>
                <button className="w-full bg-white rounded-xl px-4 py-3 font-bold text-slate-900 hover:bg-slate-50 transition cursor-pointer inline-flex items-center justify-center gap-2">
                  <img src={iconSimulate} alt="Reproducir guia" className="w-5 h-5" />
                  Reproducir guia
                </button>
              </article>

              <article className="bg-slate-100 rounded-2xl p-6 sm:p-7 space-y-4">
                <p className="text-xs uppercase tracking-wider font-bold text-slate-600">Proximos pasos</p>
                <ul className="space-y-3 text-slate-800">
                  <li className="flex gap-2"><img src={iconSeal} alt="Paso 1" className="w-5 h-5 mt-0.5" /><span>Llevar DNI fisico original.</span></li>
                  <li className="flex gap-2"><img src={iconSeal} alt="Paso 2" className="w-5 h-5 mt-0.5" /><span>Respetar el horario de 8am a 5pm.</span></li>
                  <li className="flex gap-2"><img src={iconSeal} alt="Paso 3" className="w-5 h-5 mt-0.5" /><span>Confirmar recepcion en el portal.</span></li>
                </ul>
              </article>
            </aside>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
