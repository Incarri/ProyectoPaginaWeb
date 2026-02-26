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
    <section id="contacto" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">Contactame</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Listo para encontrar tu hogar ideal? Estoy aqui para ayudarte
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl mb-6">Informacion de Contacto</h3>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4 flex-shrink-0">
                  <Phone className="text-blue-600" size={24} />
                </div>
                <div>
                  <div className="mb-1">Telefono</div>
                  <a href={`tel:${normalizePhone(agent.phone)}`} className="text-xl text-blue-600 hover:text-blue-700">
                    {agent.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4 flex-shrink-0">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div>
                  <div className="mb-1">Email</div>
                  <a href={`mailto:${agent.email}`} className="text-xl text-blue-600 hover:text-blue-700">
                    {agent.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4 flex-shrink-0">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <div>
                  <div className="mb-1">Oficina</div>
                  <p className="text-xl text-gray-700">
                    {agent.Oficina}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
              <h4 className="text-xl mb-3">Horario de Atencion</h4>
              <div className="space-y-2 text-gray-700">
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

          <div>
            <h3 className="text-2xl mb-6">Enviame un Mensaje</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-gray-700">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 text-gray-700">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                  placeholder="Cuentame sobre tus necesidades inmobiliarias..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Send size={20} />
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
