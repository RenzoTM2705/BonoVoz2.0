import Footer from '../../components/Footer'
import iconConsult from '../../assets/icon-consult.svg'
import iconAssistant from '../../assets/icon-assistant.svg'
import mainPicture from '../../assets/main-picture.svg'
import iconBiometry from '../../assets/icon-biometry.svg'
import iconSeal from '../../assets/icon-seal.svg'
import iconLogistics from '../../assets/icon-logistics.svg'

export default function Principal() {
    return (
        <div className="w-full min-h-screen bg-slate-50">
            {/* Main Content */}
            <main>
                {/* Hero Section */}
                <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            {/* Left Content */}
                            <div className="space-y-6 sm:space-y-8">
                                {/* Badge */}
                                <div className="inline-flex bg-amber-300 text-amber-900 px-4 py-2 rounded-full">
                                    <span className="text-xs sm:text-sm font-semibold tracking-wide">NUEVA VERSIÓN 2.0</span>
                                </div>

                                {/* Heading */}
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                                    Tu voz es tu llave para el Bono del Estado
                                </h1>

                                {/* Subheading */}
                                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                                    Inclusión total sin trámites complejos. Accede a tus beneficios usando solo tu voz, de manera segura y sin salir de casa.
                                </p>


                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                                    <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-slate-800 transition font-semibold text-sm sm:text-base cursor-pointer">
                                        <div className="w-5 h-5 bg-cover bg-no-repeat shrink-0" style={{ backgroundImage: `url(${iconConsult})` }} />
                                        <span>Consultar mi Bono</span>
                                    </button>
                                    <button className="flex items-center justify-center gap-2 bg-amber-300 text-amber-900 px-4 sm:px-6 py-3 rounded-lg hover:bg-amber-400 transition font-semibold text-sm sm:text-base cursor-pointer">
                                        <div className="w-5 h-5 bg-cover bg-no-repeat shrink-0" style={{ backgroundImage: `url(${iconAssistant})` }} />
                                        <span>Hablar con Asistente</span>
                                    </button>
                                </div>

                                {/* Info Box */}
                                <div className="mt-6 p-4 bg-slate-100 border-l-4 border-amber-600 rounded">
                                    <p className="text-sm sm:text-base text-slate-700">
                                        <span className="font-semibold">Ahorra hasta un 85% en gastos de traslados</span> con la verificación digital.
                                    </p>
                                </div>
                            </div>

                            {/* Right Illustration */}
                            <div className="relative w-full">
                                <div className="absolute -inset-3 sm:-inset-4 rounded-4xl" />
                                <div className="relative overflow-hidden rounded-4xl border-none bg-white">
                                    <img
                                        src={mainPicture}
                                        alt="Vista principal de BonoVoz"
                                        className="w-full h-80 sm:h-105 lg:h-130 object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-12 sm:mb-16 lg:mb-20">
                            Diseñado para tu tranquilidad
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                            {/* Feature 1 */}
                            <div className="p-6 sm:p-8 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <div className="w-7 h-7 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${iconBiometry})` }} />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">Biometría de Voz</h3>
                                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                                    No necesitas contraseñas difíciles. Tu voz es única y sirve como firma digital para identificarte ante el Estado.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-6 sm:p-8 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
                                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                    <div className="w-7 h-7 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${iconSeal})` }} />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">Sello Digital</h3>
                                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                                    Seguridad de nivel bancario en cada transacción. Tus datos están protegidos por el marco legal del Gobierno del Perú.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-6 sm:p-8 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <div className="w-7 h-7 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${iconLogistics})` }} />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">Logística Eficiente</h3>
                                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                                    Gestión directa con el Banco de la Nación. Recibe tu subsidio en el punto más cercano sin colas innecesarias.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 sm:mb-16 lg:mb-20">
                            ¿Cómo funciona BonoVoz?
                        </h2>

                        <div className="space-y-8 sm:space-y-10 max-w-4xl mx-auto">
                            {/* Step 1 */}
                            <div className="flex gap-4 sm:gap-6">
                                <div className="shrink-0 w-12 h-12 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center">
                                    <div className="w-6 h-6 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${iconConsult})` }} />
                                </div>
                                <div className="pt-1">
                                    <h3 className="text-lg sm:text-xl font-bold mb-2">Regístrate</h3>
                                    <p className="text-sm sm:text-base text-slate-300">
                                        Ingresa tu DNI y graba una frase corta para crear tu huella vocal segura.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex gap-4 sm:gap-6">
                                <div className="shrink-0 w-12 h-12 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center">
                                    <div className="w-6 h-6 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${iconBiometry})` }} />
                                </div>
                                <div className="pt-1">
                                    <h3 className="text-lg sm:text-xl font-bold mb-2">Verifica</h3>
                                    <p className="text-sm sm:text-base text-slate-300">
                                        El sistema validará tu identidad automáticamente mediante inteligencia artificial.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex gap-4 sm:gap-6">
                                <div className="shrink-0 w-12 h-12 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center">
                                    <div className="w-6 h-6 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${iconSeal})` }} />
                                </div>
                                <div className="pt-1">
                                    <h3 className="text-lg sm:text-xl font-bold mb-2">Cobra</h3>
                                    <p className="text-sm sm:text-base text-slate-300">
                                        Elige tu modalidad de pago y recibe la confirmación inmediata en tu celular.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
