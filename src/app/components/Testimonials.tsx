import { Star, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';

const TESTIMONIALS_CACHE_KEY = 'testimonials-cache-v1';
const TESTIMONIALS_CACHE_TTL_MS = 5 * 60 * 1000;

export function Testimonials() {
  const defaultTestimonials = [
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

  const [testimonials, setTestimonials] = useState<typeof defaultTestimonials>(() => {
    try {
      const raw = localStorage.getItem(TESTIMONIALS_CACHE_KEY);
      if (!raw) return defaultTestimonials;
      const parsed = JSON.parse(raw) as { timestamp: number; data: typeof defaultTestimonials };
      if (!parsed?.timestamp || !Array.isArray(parsed?.data)) return defaultTestimonials;
      if (Date.now() - parsed.timestamp > TESTIMONIALS_CACHE_TTL_MS) return defaultTestimonials;
      return parsed.data.length ? parsed.data : defaultTestimonials;
    } catch {
      return defaultTestimonials;
    }
  });
  const [formData, setFormData] = useState({ name: '', role: '', text: '', rating: 5 });
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar testimonios de Firestore
  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const testimonialsQuery = query(
        collection(db, 'testimonials'),
        orderBy('timestamp', 'desc'),
        limit(12)
      );
      const querySnapshot = await getDocs(testimonialsQuery);
      const customTestimonials = querySnapshot.docs.map(doc => ({
        name: doc.data().name,
        role: doc.data().role,
        text: doc.data().text,
        rating: doc.data().rating,
      }));
      const nextTestimonials = [...defaultTestimonials, ...customTestimonials];
      setTestimonials(nextTestimonials);
      try {
        localStorage.setItem(
          TESTIMONIALS_CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data: nextTestimonials })
        );
      } catch {
        // Ignore quota/access errors.
      }
    } catch (error) {
      console.error('Error cargando testimonios:', error);
      setTestimonials(defaultTestimonials);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.text.trim() || !formData.role.trim()) {
      setErrorMessage('Por favor completa todos los campos');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'testimonials'), {
        name: formData.name,
        role: formData.role,
        text: formData.text,
        rating: formData.rating,
        timestamp: serverTimestamp(),
      });

      setFormData({ name: '', role: '', text: '', rating: 5 });
      setShowForm(false);
      
      // Mostrar mensaje de éxito
      setSuccessMessage(`¡Gracias ${formData.name}! Tu testimonio ha sido añadido exitosamente.`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      
      // Recargar testimonios
      await loadTestimonials();
    } catch (error) {
      console.error('Error guardando testimonio:', error);
      setErrorMessage('Error al guardar el testimonio. Intenta nuevamente.');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="testimonios" className="py-20 px-4 bg-gray-50">
      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideOutUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-30px);
          }
        }
        .animate-slide-in {
          animation: slideInDown 0.5s ease-out;
        }
        .animate-slide-out {
          animation: slideOutUp 0.5s ease-in;
        }
      `}</style>

      {/* Mensaje de Éxito */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-2xl flex items-center gap-3 max-w-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-bold text-lg">¡Éxito!</p>
              <p className="text-sm">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de Error */}
      {showError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in">
          <div className="bg-red-500 text-white px-8 py-4 rounded-lg shadow-2xl flex items-center gap-3 max-w-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <div>
              <p className="font-bold text-lg">Oops!</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">Lo Que Dicen Mis Clientes</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            La satisfacción de mis clientes es mi mayor logro
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
              <div>
                <div className="text-lg font-semibold">{testimonial.name}</div>
                <div className="text-gray-500 text-sm">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón para mostrar formulario */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
          >
            {showForm ? '✕ Cancelar' : '✨ Comparte tu Testimonio'}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto mb-12 animate-slide-in">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Cuéntanos tu Experiencia</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Tu Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Tu Rol</label>
                <input
                  type="text"
                  placeholder="Ej: Comprador, Vendedor, Inversor"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Tu Testimonio</label>
                <textarea
                  placeholder="Cuéntanos sobre tu experiencia..."
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none h-24"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Calificación</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none transform hover:scale-110 transition-transform"
                    >
                      <Star
                        size={32}
                        className={star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                <Send size={20} />
                {loading ? 'Guardando...' : 'Enviar Testimonio'}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
