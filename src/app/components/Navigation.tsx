import { useState, useEffect } from 'react';
import { Home, Menu, X, Lock } from 'lucide-react';
import { agent } from '../data/agent';

function scrollToSectionWithRetry(id: string, retries = 12) {
  const attempt = (left: number) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (left > 0) {
      setTimeout(() => attempt(left - 1), 120);
    }
  };
  attempt(retries);
}

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (id: string) => {
    scrollToSectionWithRetry(id);
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    { id: 'sobre-mi', label: 'Sobre Mi' },
    { id: 'servicios', label: 'Servicios' },
    { id: 'propiedades', label: 'Propiedades' },
    { id: 'testimonios', label: 'Testimonios' },
    { id: 'contacto', label: 'Contacto' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/78 backdrop-blur-xl border-b border-slate-200/70 shadow-lg shadow-slate-900/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 text-xl"
          >
            <div
              className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all ${
                isScrolled ? 'bg-blue-600 shadow-md shadow-blue-600/35' : 'bg-white/95 border border-white/60'
              }`}
            >
              <Home className={isScrolled ? 'text-white' : 'text-blue-600'} size={24} />
            </div>
            <span className={`font-semibold ${isScrolled ? 'text-slate-900' : 'text-white drop-shadow'}`}>
              {agent.name}
            </span>
          </button>

          <div className="hidden md:flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-3 py-2 shadow-lg shadow-slate-900/10">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  isScrolled
                    ? 'text-slate-700 hover:text-blue-700 hover:bg-blue-50'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              title="Admin"
              onClick={() => window.dispatchEvent(new CustomEvent('open-admin-login'))}
              className={`${isScrolled ? 'text-slate-400 hover:text-slate-700' : 'text-white/70 hover:text-white'} p-2 opacity-80 hover:opacity-100`}
            >
              <Lock size={18} />
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? 'text-slate-900' : 'text-white'} size={28} />
            ) : (
              <Menu className={isScrolled ? 'text-slate-900' : 'text-white'} size={28} />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 rounded-2xl glass-card overflow-hidden">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`block w-full text-left px-6 py-4 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-slate-200/70' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
