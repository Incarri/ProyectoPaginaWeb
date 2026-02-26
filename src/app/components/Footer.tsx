import { Home, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { agent } from '../data/agent';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const normalizePhone = (value: string) => value.replace(/[^\d]/g, '');

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white py-14 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(37,99,235,0.25),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(14,165,233,0.2),transparent_35%)]"></div>
      <div className="relative max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg shadow-lg shadow-blue-700/30">
                <Home size={24} />
              </div>
              <span className="text-xl font-semibold">{agent.name}</span>
            </div>
            <p className="text-slate-300">
              Tu socio de confianza en el mercado inmobiliario para lograr operaciones seguras y exitosas.
            </p>
          </div>

          <div>
            <h4 className="text-lg mb-4">Enlaces</h4>
            <ul className="space-y-2 text-slate-300">
              <li><button onClick={() => document.getElementById('sobre-mi')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white">Sobre Mi</button></li>
              <li><button onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white">Servicios</button></li>
              <li><button onClick={() => document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white">Propiedades</button></li>
              <li><button onClick={() => document.getElementById('testimonios')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white">Testimonios</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg mb-4">Contacto</h4>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <Phone size={18} className="mt-1 flex-shrink-0" />
                <a href={`tel:${normalizePhone(agent.phone)}`} className="hover:text-white transition-colors">{agent.phone}</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={18} className="mt-1 flex-shrink-0" />
                <a href={`mailto:${agent.email}`} className="hover:text-white transition-colors">{agent.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                {agent.Oficina}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg mb-4">Redes</h4>
            <div className="flex gap-3">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="flex items-center justify-center w-10 h-10 bg-white/10 border border-white/20 rounded-xl hover:bg-blue-600 hover:border-blue-500 transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 pt-8 text-center text-slate-300">
          <p>&copy; {currentYear} {agent.name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
