import { Home, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Home size={24} />
              </div>
              <span className="text-xl">Inmobiliaria Premium</span>
            </div>
            <p className="text-gray-400">
              Tu socio de confianza en el mercado inmobiliario. Haciendo realidad el sueño de tu hogar perfecto.
            </p>
          </div>

          <div>
            <h4 className="text-lg mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => document.getElementById('sobre-mi')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white transition-colors"
                >
                  Sobre Mí
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white transition-colors"
                >
                  Servicios
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white transition-colors"
                >
                  Propiedades
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('testimonios')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white transition-colors"
                >
                  Testimonios
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg mb-4">Contacto</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <Phone size={18} className="mt-1 flex-shrink-0" />
                <a href="tel:+34912345678" className="hover:text-white transition-colors">
                  +34 912 345 678
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={18} className="mt-1 flex-shrink-0" />
                <a href="mailto:contacto@inmobiliaria.com" className="hover:text-white transition-colors">
                  contacto@inmobiliaria.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>Calle Gran Vía, 123<br />28013 Madrid, España</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg mb-4">Sígueme</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
            <p className="text-gray-400 mt-4 text-sm">
              Lunes - Viernes: 9:00 - 20:00<br />
              Sábados: 10:00 - 14:00
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Inmobiliaria Premium. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
