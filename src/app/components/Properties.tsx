import { ImageWithFallback } from './figma/ImageWithFallback';
import { BedDouble, Bath, Square, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { lazy, Suspense, useRef, useEffect, useState } from 'react';
import { fetchProperties, type Property } from '../../lib/propertiesService';
import { availableProperties as localAvailable, soldProperties as localSold } from '../data/properties';
import { PropertyDetailModal } from './PropertyDetailModal';

const PROPERTIES_CACHE_KEY = 'properties-cache-v1';
const PROPERTIES_CACHE_TTL_MS = 5 * 60 * 1000;

function readPropertiesCache(): { available: Property[]; sold: Property[] } | null {
  try {
    const raw = localStorage.getItem(PROPERTIES_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { timestamp: number; data: { available: Property[]; sold: Property[] } };
    if (!parsed?.timestamp || !parsed?.data) return null;
    if (Date.now() - parsed.timestamp > PROPERTIES_CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writePropertiesCache(data: { available: Property[]; sold: Property[] }) {
  try {
    localStorage.setItem(
      PROPERTIES_CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  } catch {
    // Ignore quota/access errors and continue with in-memory state.
  }
}

const AdminProperties = lazy(() =>
  import('./AdminProperties').then((m) => ({ default: m.AdminProperties }))
);

export function Properties() {

  const availableSliderRef = useRef<Slider | null>(null);
  const soldSliderRef = useRef<Slider | null>(null);

  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)');
    const update = () => setIsCoarsePointer(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const slidesToShowBase = isCoarsePointer ? 1 : 3;

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShowBase,
    slidesToScroll: 1,
    arrows: false,
    lazyLoad: 'ondemand' as const,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: isCoarsePointer ? 1 : 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
    ],
  };

  const cached = readPropertiesCache();
  const [available, setAvailable] = useState<Property[]>(cached?.available ?? (localAvailable as unknown as Property[]));
  const [sold, setSold] = useState<Property[]>(cached?.sold ?? (localSold as unknown as Property[]));
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  useEffect(() => {
    const handler = () => setShowAdminLogin(true);
    window.addEventListener('open-admin-login', handler as EventListener);
    return () => window.removeEventListener('open-admin-login', handler as EventListener);
  }, []);
  
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProperties();
        const next = {
          available: res.available.length ? res.available : [],
          sold: res.sold.length ? res.sold : [],
        };
        setAvailable(next.available);
        setSold(next.sold);
        writePropertiesCache(next);
      } catch (e) {
        console.error('Error cargando propiedades:', e);
      }
    };
    load();
  }, []);

  return (
    <section id="propiedades" className="section-shell py-24 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">

        {/* ===================== */}
        {/* PROPIEDADES DISPONIBLES */}
        {/* ===================== */}

        <div className="text-center mb-16 relative">
          <h2 className="section-title mb-4">
            Propiedades Disponibles
          </h2>
          {/* Admin lock moved to Navigation (subtle) */}
        </div>

        {/* Admin login modal */}
        {showAdminLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdminLogin(false)}></div>
            <div className="bg-white rounded-lg p-6 z-60 w-96">
              <h3 className="font-bold mb-2">Acceso Admin</h3>
              <p className="text-sm text-gray-600 mb-4">Introduce la contraseña para acceder al panel.</p>
              <div className="flex gap-2">
                <input id="admin-pass" type="password" placeholder="Contraseña" className="flex-1 px-3 py-2 border rounded" />
                <button
                  className="bg-blue-600 text-white px-3 py-2 rounded"
                  onClick={() => {
                    const input = (document.getElementById('admin-pass') as HTMLInputElement)?.value;
                    if (input === 'admin123') {
                      setShowAdminLogin(false);
                      setShowAdminPanel(true);
                    } else {
                      alert('Contraseña incorrecta');
                    }
                  }}
                >Entrar</button>
              </div>
            </div>
          </div>
        )}

        {showAdminPanel && (
          <Suspense fallback={<div className="text-center py-8 text-slate-600">Cargando panel admin...</div>}>
            <AdminProperties onClose={() => { setShowAdminPanel(false); window.location.reload(); }} onReload={async () => {
              const res = await fetchProperties();
              setAvailable(res.available);
              setSold(res.sold);
              writePropertiesCache({ available: res.available, sold: res.sold });
            }} />
          </Suspense>
        )}

        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />

        <div className="relative mb-24">

          <button
            onClick={() => availableSliderRef.current?.slickPrev()}
            className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-4 z-10 bg-white/95 hover:bg-blue-600 text-gray-800 hover:text-white rounded-full p-2 md:p-3 shadow-lg"
          >
            <ChevronLeft size={22} className="md:w-7 md:h-7" />
          </button>

          <Slider ref={availableSliderRef} {...settings}>
            {(available.length ? available : []).map((property) => (
              <div key={property.id} className="px-2 md:px-4">
                <div
                  className="glass-card lift-hover rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 modern-btn-primary text-white px-4 py-2 rounded-xl text-sm">
                      {property.price}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl mb-2">{property.title}</h3>

                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin size={16} className="mr-1" />
                      <span>{property.location}</span>
                    </div>

                    <div className="flex justify-between text-gray-700 border-t border-slate-200/70 pt-4">
                      <div className="flex items-center">
                        <BedDouble size={18} className="mr-2 text-blue-600" />
                        <span>{property.beds} hab.</span>
                      </div>

                      <div className="flex items-center">
                        <Bath size={18} className="mr-2 text-blue-600" />
                        <span>{property.baths} baños</span>
                      </div>

                      <div className="flex items-center">
                        <Square size={18} className="mr-2 text-blue-600" />
                        <span>{property.area} m²</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedProperty(property);
                      }}
                      className="mt-4 modern-btn-ghost rounded-lg px-4 py-2 text-sm"
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          <button
            onClick={() => availableSliderRef.current?.slickNext()}
            className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-4 z-10 bg-white/95 hover:bg-blue-600 text-gray-800 hover:text-white rounded-full p-2 md:p-3 shadow-lg"
          >
            <ChevronRight size={22} className="md:w-7 md:h-7" />
          </button>

        </div>

        {/* ===================== */}
        {/* PROPIEDADES VENDIDAS */}
        {/* ===================== */}

        <div className="text-center mb-16">
          <h2 className="section-title mb-4">
            Propiedades Vendidas
          </h2>
        </div>

        <div className="relative">

          <button
            onClick={() => soldSliderRef.current?.slickPrev()}
            className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-4 z-10 bg-white/95 hover:bg-green-600 text-gray-800 hover:text-white rounded-full p-2 md:p-3 shadow-lg"
          >
            <ChevronLeft size={22} className="md:w-7 md:h-7" />
          </button>

          <Slider ref={soldSliderRef} {...settings}>
            {(sold.length ? sold : []).map((property) => (
              <div key={property.id} className="px-2 md:px-4">
                <div
                  className="glass-card lift-hover rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-xl text-sm">
                      Vendido
                    </div>

                    <div className="absolute top-4 right-4 bg-slate-900/90 text-white px-4 py-2 rounded-xl text-sm">
                      {property.price}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl mb-2">{property.title}</h3>

                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin size={16} className="mr-1" />
                      <span>{property.location}</span>
                    </div>

                    <div className="flex justify-between text-gray-700 border-t border-slate-200/70 pt-4">
                      <div className="flex items-center">
                        <BedDouble size={18} className="mr-2 text-blue-600" />
                        <span>{property.beds} hab.</span>
                      </div>

                      <div className="flex items-center">
                        <Bath size={18} className="mr-2 text-blue-600" />
                        <span>{property.baths} baños</span>
                      </div>

                      <div className="flex items-center">
                        <Square size={18} className="mr-2 text-blue-600" />
                        <span>{property.area} m²</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedProperty(property);
                      }}
                      className="mt-4 modern-btn-ghost rounded-lg px-4 py-2 text-sm"
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          <button
            onClick={() => soldSliderRef.current?.slickNext()}
            className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-4 z-10 bg-white/95 hover:bg-green-600 text-gray-800 hover:text-white rounded-full p-2 md:p-3 shadow-lg"
          >
            <ChevronRight size={22} className="md:w-7 md:h-7" />
          </button>

        </div>

      </div>
    </section>
  );
}
