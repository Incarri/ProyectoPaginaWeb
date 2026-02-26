import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';

const About = lazy(() => import('./components/About').then((m) => ({ default: m.About })));
const Services = lazy(() => import('./components/Services').then((m) => ({ default: m.Services })));
const Properties = lazy(() => import('./components/Properties').then((m) => ({ default: m.Properties })));
const Testimonials = lazy(() => import('./components/Testimonials').then((m) => ({ default: m.Testimonials })));
const Contact = lazy(() => import('./components/Contact').then((m) => ({ default: m.Contact })));
const Footer = lazy(() => import('./components/Footer').then((m) => ({ default: m.Footer })));

function SectionFallback() {
  return <div className="h-24" />;
}

function LazyMount({ children, minHeight = 240 }: { children: ReactNode; minHeight?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '320px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div ref={containerRef} style={{ minHeight }}>
      {isVisible ? children : <SectionFallback />}
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <LazyMount minHeight={420}>
        <Suspense fallback={<SectionFallback />}>
          <About />
        </Suspense>
      </LazyMount>
      <LazyMount minHeight={420}>
        <Suspense fallback={<SectionFallback />}>
          <Services />
        </Suspense>
      </LazyMount>
      <LazyMount minHeight={560}>
        <Suspense fallback={<SectionFallback />}>
          <Properties />
        </Suspense>
      </LazyMount>
      <LazyMount minHeight={520}>
        <Suspense fallback={<SectionFallback />}>
          <Testimonials />
        </Suspense>
      </LazyMount>
      <LazyMount minHeight={420}>
        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
      </LazyMount>
      <LazyMount minHeight={220}>
        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </LazyMount>
    </div>
  );
}
