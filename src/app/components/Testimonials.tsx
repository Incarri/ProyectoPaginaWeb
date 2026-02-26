import { Star, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';

const TESTIMONIALS_CACHE_KEY = 'testimonials-cache-v1';
const TESTIMONIALS_CACHE_TTL_MS = 5 * 60 * 1000;

export function Testimonials() {
  const defaultTestimonials = [
    {
      name: 'Maria Gonzalez',
      role: 'Compradora',
      text: 'Gracias a su profesionalismo y dedicacion, encontramos la casa perfecta para nuestra familia. El proceso fue fluido y siempre estuvo disponible para resolver nuestras dudas.',
      rating: 5,
    },
    {
      name: 'Carlos Rodriguez',
      role: 'Vendedor',
      text: 'Vendi mi apartamento en tiempo record y por encima del precio esperado. Su estrategia de marketing y conocimiento del mercado son excelentes.',
      rating: 5,
    },
    {
      name: 'Ana Martinez',
      role: 'Inversora',
      text: 'Como inversora, necesitaba un asesor que entienda el mercado a profundidad. Sus recomendaciones fueron claves para crecer mi cartera.',
      rating: 5,
    },
    {
      name: 'David Lopez',
      role: 'Comprador',
      text: 'Excelente atencion y profesionalismo. Me guio paso a paso en mi primera compra de vivienda, explicando cada detalle.',
      rating: 5,
    },
    {
      name: 'Laura Sanchez',
      role: 'Vendedora',
      text: 'Su dedicacion y conocimiento del sector son impresionantes. Logro vender mi propiedad en menos de un mes.',
      rating: 5,
    },
    {
      name: 'Javier Fernandez',
      role: 'Comprador',
      text: 'Encontrar la casa de nuestros suenos parecia imposible, pero gracias a su perseverancia y criterio lo logramos.',
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
      const customTestimonials = querySnapshot.docs.map((doc) => ({
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
        // ignore cache errors
      }
    } catch (error) {
      console.error('Error cargando testimonios:', error);
      setTestimonials(defaultTestimonials);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.text.trim() || !formData.role.trim()) {
      setErrorMessage('Por favor completa todos los campos.');
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
      setSuccessMessage(`Gracias ${formData.name}. Tu testimonio fue anadido correctamente.`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
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
    <section id="testimonios" className="section-shell py-24 px-4 bg-gradient-to-b from-slate-50/90 to-white">
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-emerald-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-bold text-lg">Exito</p>
              <p className="text-sm">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-rose-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <div>
              <p className="font-bold text-lg">Error</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">Lo Que Dicen Mis Clientes</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            La satisfaccion de mis clientes es mi mayor logro.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glass-card lift-hover p-8 rounded-2xl">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                ))}
              </div>
              <p className="text-slate-700 mb-6 italic">"{testimonial.text}"</p>
              <div>
                <div className="text-lg font-semibold text-slate-900">{testimonial.name}</div>
                <div className="text-slate-500 text-sm">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="modern-btn-primary px-8 py-3 rounded-xl text-lg transition-all font-semibold hover:scale-[1.02]"
          >
            {showForm ? 'Cancelar' : 'Comparte tu testimonio'}
          </button>
        </div>

        {showForm && (
          <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-bold mb-6 text-slate-900">Cuentanos tu experiencia</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Tu nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/85 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2">Tu rol</label>
                <input
                  type="text"
                  placeholder="Ej: Comprador, Vendedor, Inversor"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 bg-white/85 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2">Tu testimonio</label>
                <textarea
                  placeholder="Cuentanos sobre tu experiencia..."
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-4 py-3 bg-white/85 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none h-28"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2">Calificacion</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none transform hover:scale-110 transition-transform"
                    >
                      <Star
                        size={30}
                        className={star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full modern-btn-primary disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
              >
                <Send size={20} />
                {loading ? 'Guardando...' : 'Enviar testimonio'}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
