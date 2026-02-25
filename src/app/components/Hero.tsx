import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1706808849777-96e0d7be3bb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MTQ2MjM4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Propiedad de lujo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl mb-6">
          Tu Hogar Soñado Te Espera
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          Experto en bienes raíces con más de 15 años de experiencia ayudando a familias a encontrar su hogar perfecto
        </p>
        <button
          onClick={() => scrollToSection('contacto')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg transition-colors"
        >
          Contáctame Ahora
        </button>
      </div>

      <button
        onClick={() => scrollToSection('sobre-mi')}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-white animate-bounce"
        aria-label="Desplazar hacia abajo"
      >
        <ChevronDown size={40} />
      </button>
    </section>
  );
}
