import { MapPin, BedDouble, Bath, Square, X, MessageCircle, Map } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Property } from '../../lib/propertiesService';
import { agent } from '../data/agent';

type Props = {
  property: Property | null;
  onClose: () => void;
};

function normalizePhone(value: string) {
  return value.replace(/[^\d]/g, '');
}

function defaultDescription(property: Property) {
  return `Descubre ${property.title}, una propiedad ubicada en ${property.location}. Cuenta con ${property.beds} habitaciones, ${property.baths} baños y ${property.area} m², ideal para quienes buscan comodidad, estilo y una excelente ubicación.`;
}

export function PropertyDetailModal({ property, onClose }: Props) {
  if (!property) return null;

  const whatsappNumber = normalizePhone(agent.phone);
  const mapsQuery = `${property.title}, ${property.location}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
  const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`;
  const message = encodeURIComponent(
    property.sold
      ? `Hola, vi que la propiedad "${property.title}" en ${property.location} ya fue vendida. ¿Podrías mostrarme opciones similares disponibles?`
      : `Hola, estoy interesado(a) en la propiedad "${property.title}" ubicada en ${property.location}. ¿Podrías brindarme más información?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

      <div className="relative z-[121] w-full max-w-4xl max-h-[90vh] overflow-auto glass-card rounded-3xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2"
          aria-label="Cerrar detalle"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative min-h-[280px]">
            <ImageWithFallback
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover md:rounded-l-3xl"
            />
            <div className="absolute top-4 left-4 modern-btn-primary px-4 py-2 rounded-xl text-sm">
              {property.price}
            </div>
            {property.sold && (
              <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-xl text-sm">
                Vendido
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            <h3 className="text-3xl text-slate-900 mb-3">{property.title}</h3>
            <div className="flex items-center text-slate-600 mb-5">
              <MapPin size={16} className="mr-2" />
              <span>{property.location}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="modern-btn-ghost rounded-xl p-3 text-center">
                <BedDouble size={18} className="mx-auto mb-1 text-blue-700" />
                <div className="text-sm text-slate-700">{property.beds} hab.</div>
              </div>
              <div className="modern-btn-ghost rounded-xl p-3 text-center">
                <Bath size={18} className="mx-auto mb-1 text-blue-700" />
                <div className="text-sm text-slate-700">{property.baths} baños</div>
              </div>
              <div className="modern-btn-ghost rounded-xl p-3 text-center">
                <Square size={18} className="mx-auto mb-1 text-blue-700" />
                <div className="text-sm text-slate-700">{property.area} m²</div>
              </div>
            </div>

            <h4 className="text-lg text-slate-900 mb-2">Descripción</h4>
            <p className="text-slate-600 leading-relaxed mb-7">
              {property.description?.trim() || defaultDescription(property)}
            </p>

            <div className="mb-7">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg text-slate-900">Ubicación en mapa</h4>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-700 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  <Map size={15} />
                  Abrir en Google Maps
                </a>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200">
                <iframe
                  title={`Mapa de ${property.title}`}
                  src={mapsEmbedUrl}
                  className="w-full h-56"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full modern-btn-primary rounded-xl px-5 py-3 inline-flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              {property.sold ? 'Pedir opciones similares' : 'Contactar por WhatsApp'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
