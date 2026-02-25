import { ImageWithFallback } from './figma/ImageWithFallback';
import { BedDouble, Bath, Square, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { availableProperties, soldProperties } from "../data/properties";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRef } from 'react';

export function Properties() {

  const availableSliderRef = useRef<Slider | null>(null);
  const soldSliderRef = useRef<Slider | null>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section id="propiedades" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* ===================== */}
        {/* PROPIEDADES DISPONIBLES */}
        {/* ===================== */}

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">
            Propiedades Disponibles
          </h2>
        </div>

        <div className="relative mb-24">

          <button
            onClick={() => availableSliderRef.current?.slickPrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-blue-600 text-gray-800 hover:text-white rounded-full p-3 shadow-lg hidden md:block"
          >
            <ChevronLeft size={28} />
          </button>

          <Slider ref={availableSliderRef} {...settings}>
            {availableProperties.map((property) => (
              <div key={property.id} className="px-4">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
                      {property.price}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl mb-2">{property.title}</h3>

                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin size={16} className="mr-1" />
                      <span>{property.location}</span>
                    </div>

                    <div className="flex justify-between text-gray-700 border-t pt-4">
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
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          <button
            onClick={() => availableSliderRef.current?.slickNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-blue-600 text-gray-800 hover:text-white rounded-full p-3 shadow-lg hidden md:block"
          >
            <ChevronRight size={28} />
          </button>

        </div>

        {/* ===================== */}
        {/* PROPIEDADES VENDIDAS */}
        {/* ===================== */}

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">
            Propiedades Vendidas
          </h2>
        </div>

        <div className="relative">

          <button
            onClick={() => soldSliderRef.current?.slickPrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-green-600 text-gray-800 hover:text-white rounded-full p-3 shadow-lg hidden md:block"
          >
            <ChevronLeft size={28} />
          </button>

          <Slider ref={soldSliderRef} {...settings}>
            {soldProperties.map((property) => (
              <div key={property.id} className="px-4">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
                      Vendido
                    </div>

                    <div className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg">
                      {property.price}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl mb-2">{property.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          <button
            onClick={() => soldSliderRef.current?.slickNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-green-600 text-gray-800 hover:text-white rounded-full p-3 shadow-lg hidden md:block"
          >
            <ChevronRight size={28} />
          </button>

        </div>

      </div>
    </section>
  );
}