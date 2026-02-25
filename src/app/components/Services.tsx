import { Search, DollarSign, FileText, Key, HeadphonesIcon, TrendingUp } from 'lucide-react';

export function Services() {
  const services = [
    {
      icon: Search,
      title: 'Búsqueda Personalizada',
      description: 'Te ayudo a encontrar la propiedad perfecta según tus necesidades, presupuesto y preferencias.',
    },
    {
      icon: DollarSign,
      title: 'Valoración de Propiedades',
      description: 'Análisis detallado del mercado para determinar el valor real de tu propiedad y maximizar tu inversión.',
    },
    {
      icon: FileText,
      title: 'Gestión Documental',
      description: 'Me encargo de todos los trámites legales y documentación necesaria para una transacción segura.',
    },
    {
      icon: Key,
      title: 'Venta de Propiedades',
      description: 'Estrategias de marketing efectivas para vender tu propiedad al mejor precio en el menor tiempo.',
    },
    {
      icon: HeadphonesIcon,
      title: 'Asesoramiento 24/7',
      description: 'Estoy disponible para resolver todas tus dudas y acompañarte en cada paso del proceso.',
    },
    {
      icon: TrendingUp,
      title: 'Inversión Inmobiliaria',
      description: 'Asesoramiento experto para invertir en propiedades con alto potencial de rentabilidad.',
    },
  ];

  return (
    <section id="servicios" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">Mis Servicios</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ofrezco una gama completa de servicios inmobiliarios diseñados para hacer realidad tus objetivos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-lg mb-4">
                  <Icon className="text-blue-600" size={28} />
                </div>
                <h3 className="text-xl mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
