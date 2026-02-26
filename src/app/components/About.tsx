import { ImageWithFallback } from './figma/ImageWithFallback';
import { Award, Users, Home, TrendingUp } from 'lucide-react';
import { agent } from '../data/agent';

export function About() {
  const stats = [
    { icon: Home, value: '500+', label: 'Propiedades vendidas' },
    { icon: Users, value: '1000+', label: 'Clientes felices' },
    { icon: Award, value: '15+', label: 'Anos de experiencia' },
    { icon: TrendingUp, value: '98%', label: 'Tasa de exito' },
  ];

  return (
    <section id="sobre-mi" className="section-shell py-24 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="section-title mb-6">Sobre Mi</h2>
            <div className="section-subtitle space-y-4 leading-relaxed">
              {agent.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-[0_25px_55px_rgba(15,23,42,0.16)]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1763478958776-ebd04b6459ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZWFsJTIwZXN0YXRlJTIwYWdlbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzE0OTU4NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Agente inmobiliario"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="glass-card lift-hover rounded-2xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-3">
                  <Icon className="text-blue-700" size={28} />
                </div>
                <div className="text-3xl md:text-4xl text-slate-900 mb-1">{stat.value}</div>
                <div className="text-slate-600 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
