import { lazy, Suspense } from 'react';
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

export default function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Suspense fallback={<SectionFallback />}>
        <About />
        <Services />
        <Properties />
        <Testimonials />
        <Contact />
        <Footer />
      </Suspense>
    </div>
  );
}
