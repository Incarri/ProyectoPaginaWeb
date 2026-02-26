import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { agent } from '../data/agent';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const normalizePhone = (value: string) => value.replace(/[^\d]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const whatsappNumber = normalizePhone(agent.phone);
    const lines = [
      'Hola, vengo desde tu web inmobiliaria.',
      '',
      `Nombre: ${formData.name}`,
      `Email: ${formData.email}`,
      '',
      `Mensaje: ${formData.message}`,
    ];

    const text = encodeURIComponent(lines.join('\n'));
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contacto" className="section-shell py-24 px-4 bg-gradient-to-b from-white to-slate-50/90">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">Contactame</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Estoy lista para ayudarte a encontrar, vender o invertir en la propiedad ideal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card rounded-3xl p-8">
            <h3 className="text-2xl text-slate-900 mb-6">Informacion de Contacto</h3>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex items-center justify-center w-12 h-12 modern-btn-ghost rounded-xl mr-4 flex-shrink-0">
                  <Phone className="text-blue-700" size={22} />
                </div>
                <div>
                  <div className="mb-1 text-slate-600">Telefono</div>
                  <a href={`tel:${normalizePhone(agent.phone)}`} className="text-xl text-slate-900 hover:text-blue-700 transition-colors">
                    {agent.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-12 h-12 modern-btn-ghost rounded-xl mr-4 flex-shrink-0">
                  <Mail className="text-blue-700" size={22} />
                </div>
                <div>
                  <div className="mb-1 text-slate-600">Email</div>
                  <a href={`mailto:${agent.email}`} className="text-xl text-slate-900 hover:text-blue-700 transition-colors">
                    {agent.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-12 h-12 modern-btn-ghost rounded-xl mr-4 flex-shrink-0">
                  <MapPin className="text-blue-700" size={22} />
                </div>
                <div>
                  <div className="mb-1 text-slate-600">Oficina</div>
                  <p className="text-xl text-slate-900">
                    {agent.Oficina}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-slate-100/80 border border-slate-200/70">
              <h4 className="text-lg text-slate-900 mb-3">Horario de Atencion</h4>
              <div className="space-y-2 text-slate-700">
                <div className="flex justify-between">
                  <span>Lunes - Viernes:</span>
                  <span>9:00 - 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sabados:</span>
                  <span>10:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingos:</span>
                  <span>Cerrado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8">
            <h3 className="text-2xl text-slate-900 mb-6">Enviame un Mensaje</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-slate-700">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 text-slate-700">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Cuentame sobre tus necesidades inmobiliarias..."
                />
              </div>

              <button
                type="submit"
                className="w-full modern-btn-primary px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Send size={20} />
                Enviar por WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
