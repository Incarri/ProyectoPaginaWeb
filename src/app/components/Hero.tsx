import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronDown, Award, Building2, BadgeCheck } from 'lucide-react';
import { agent } from '../data/agent';

const whatsappNumber = agent.phone.replace(/[^\d]/g, '');
const whatsappMessage = encodeURIComponent(
  'Hola, vi tu página web inmobiliaria y me gustaría recibir más información.'
);
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

function scrollToSectionWithRetry(id: string, retries = 12) {
  const attempt = (left: number) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (left > 0) {
      setTimeout(() => attempt(left - 1), 120);
    }
  };
  attempt(retries);
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0 hero-image-pan">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1706808849777-96e0d7be3bb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MTQ2MjM4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Propiedad de lujo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#051227]/65 via-[#08162d]/55 to-[#041021]/75"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(251,191,36,0.16),transparent_35%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-24 md:pt-28 pb-16">
        <div className="max-w-4xl hero-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 backdrop-blur-md px-4 py-2 text-sm text-white/95 mb-6">
            <BadgeCheck size={16} className="text-amber-300" />
            Asesoria inmobiliaria premium en Lima
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.45)] mb-6">
            Tu proximo hogar
            <span className="block text-amber-200">empieza aqui</span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-100/90 max-w-3xl mb-9">
            Compra, venta e inversion con estrategia real, acompanamiento total y enfoque en resultados desde el primer dia.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-lg transition-all shadow-[0_16px_35px_rgba(37,99,235,0.45)] hover:scale-[1.02]"
            >
              Hablar por WhatsApp
            </a>
            <button
              onClick={() => scrollToSectionWithRetry('propiedades')}
              className="bg-white/15 hover:bg-white/25 text-white px-8 py-4 rounded-xl text-lg border border-white/40 backdrop-blur-sm transition-all"
            >
              Ver propiedades
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl">
            <div className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-md p-4">
              <div className="flex items-center gap-2 text-amber-200 mb-1">
                <Award size={18} />
                <span className="text-sm">Experiencia</span>
              </div>
              <div className="text-2xl text-white">15+ años</div>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-md p-4">
              <div className="flex items-center gap-2 text-amber-200 mb-1">
                <Building2 size={18} />
                <span className="text-sm">Operaciones</span>
              </div>
              <div className="text-2xl text-white">200+</div>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-md p-4 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-amber-200 mb-1">
                <BadgeCheck size={18} />
                <span className="text-sm">Satisfaccion</span>
              </div>
              <div className="text-2xl text-white">98%</div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => scrollToSectionWithRetry('sobre-mi')}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-white/90 animate-bounce"
        aria-label="Desplazar hacia abajo"
      >
        <ChevronDown size={40} />
      </button>
    </section>
  );
}
