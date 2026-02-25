import { ImageWithFallback } from './figma/ImageWithFallback';
import { Award, Users, Home, TrendingUp } from 'lucide-react';
import { agent } from '../data/agent';

export function About() {
  const stats = [
    { icon: Home, value: '500+', label: 'Propiedades Vendidas' },
    { icon: Users, value: '1000+', label: 'Clientes Satisfechos' },
    { icon: Award, value: '15+', label: 'Años de Experiencia' },
    { icon: TrendingUp, value: '98%', label: 'Tasa de Éxito' },
  ];

  return (
    <section id="sobre-mi" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl mb-6">Sobre Mí</h2>
            <p className="text-lg text-gray-700 mb-4 whitespace-pre-line"> 
              {agent.description.map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </p>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1763478958776-ebd04b6459ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZWFsJTIwZXN0YXRlJTIwYWdlbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzE0OTU4NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Agente inmobiliario"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Icon className="text-blue-600" size={32} />
                </div>
                <div className="text-3xl md:text-4xl mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
