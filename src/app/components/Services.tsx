import { Search, DollarSign, FileText, Key, HeadphonesIcon, TrendingUp } from 'lucide-react';

export function Services() {
  const services = [
    {
      icon: Search,
      title: 'Busqueda personalizada',
      description: 'Te ayudo a encontrar la propiedad perfecta segun tus necesidades, presupuesto y preferencias.',
    },
    {
      icon: DollarSign,
      title: 'Valoracion de propiedades',
      description: 'Analisis detallado del mercado para determinar el valor real de tu propiedad y maximizar tu inversion.',
    },
    {
      icon: FileText,
      title: 'Gestion documental',
      description: 'Me encargo de los tramites legales y documentacion necesaria para una transaccion segura.',
    },
    {
      icon: Key,
      title: 'Venta de propiedades',
      description: 'Estrategias de marketing efectivas para vender tu propiedad al mejor precio en el menor tiempo.',
    },
    {
      icon: HeadphonesIcon,
      title: 'Asesoramiento 24/7',
      description: 'Estoy disponible para resolver dudas y acompanarte en cada paso del proceso.',
    },
    {
      icon: TrendingUp,
      title: 'Inversion inmobiliaria',
      description: 'Asesoramiento experto para invertir en propiedades con alto potencial de rentabilidad.',
    },
  ];

  return (
    <section id="servicios" className="section-shell py-24 px-4 bg-gradient-to-b from-slate-50/90 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title mb-4">Servicios Que Hacen Diferencia</h2>
          <p className="section-subtitle max-w-3xl mx-auto">
            Un servicio integral para que tomes decisiones inmobiliarias con seguridad, estrategia y resultados.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="glass-card lift-hover rounded-2xl p-8"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 modern-btn-ghost">
                  <Icon className="text-blue-700" size={28} />
                </div>
                <h3 className="text-xl text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
