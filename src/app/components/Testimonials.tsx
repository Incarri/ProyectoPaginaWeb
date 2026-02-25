import { Star } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: 'María González',
      role: 'Compradora',
      text: 'Gracias a su profesionalismo y dedicación, encontramos la casa perfecta para nuestra familia. El proceso fue increíblemente fluido y siempre estuvo disponible para resolver nuestras dudas.',
      rating: 5,
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Vendedor',
      text: 'Vendí mi apartamento en tiempo récord y por encima del precio esperado. Su estrategia de marketing y conocimiento del mercado son excepcionales. Totalmente recomendable.',
      rating: 5,
    },
    {
      name: 'Ana Martínez',
      role: 'Inversora',
      text: 'Como inversora, necesitaba un asesor que entendiera el mercado a profundidad. Sus recomendaciones han sido invaluables y mi cartera inmobiliaria ha crecido significativamente.',
      rating: 5,
    },
    {
      name: 'David López',
      role: 'Comprador',
      text: 'Excelente atención y profesionalismo. Me guió paso a paso en mi primera compra de vivienda, explicando cada detalle del proceso. ¡No podría estar más satisfecho!',
      rating: 5,
    },
    {
      name: 'Laura Sánchez',
      role: 'Vendedora',
      text: 'Su dedicación y conocimiento del sector son impresionantes. Logró vender mi propiedad en menos de un mes y siempre estuvo pendiente de cada detalle. Servicio de primera.',
      rating: 5,
    },
    {
      name: 'Javier Fernández',
      role: 'Comprador',
      text: 'Encontrar la casa de nuestros sueños parecía imposible, pero gracias a su perseverancia y profesionalismo lo logramos. Un agente en quien puedes confiar completamente.',
      rating: 5,
    },
  ];

  return (
    <section id="testimonios" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">Lo Que Dicen Mis Clientes</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            La satisfacción de mis clientes es mi mayor logro
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
              <div>
                <div className="text-lg">{testimonial.name}</div>
                <div className="text-gray-500">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
