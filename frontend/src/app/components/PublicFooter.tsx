import React, { useEffect, useRef, useState } from 'react';
import { Church, Phone, Mail, MapPin, Facebook, Youtube, Instagram } from 'lucide-react';
import { useShrineData } from '../context/ShrineDataContext';

export const PublicFooter: React.FC = () => {
  const { siteContent } = useShrineData();
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="bg-green-900 text-white mt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section with slide-in animation */}
          <div className={`transform transition-all duration-700 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}>
            <div className="flex items-center gap-2 mb-4 group">
              <Church className="w-6 h-6 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <span className="font-semibold transition-all duration-300 group-hover:text-green-200">
                Devasahayam Mount Shrine
              </span>
            </div>
            <p className="text-green-100 text-sm leading-relaxed transition-all duration-300 hover:text-white">
              A sacred place of prayer and pilgrimage dedicated to Saint Devasahayam Pillai.
            </p>
          </div>

          {/* Contact Info with fade-in animation */}
          <div className={`transform transition-all duration-700 delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h3 className="font-semibold mb-4 transition-colors duration-300 hover:text-green-200">
              Contact Us
            </h3>
            <div className="space-y-3 text-sm text-green-100">
              <div className="flex items-start gap-2 group transition-all duration-300 hover:translate-x-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 transition-all duration-300 group-hover:text-green-300 group-hover:scale-110" />
                <span className="transition-colors duration-300 group-hover:text-white">
                  {siteContent.contactAddress}
                </span>
              </div>
              <div className="flex items-center gap-2 group transition-all duration-300 hover:translate-x-2">
                <Phone className="w-4 h-4 flex-shrink-0 transition-all duration-300 group-hover:text-green-300 group-hover:scale-110" />
                <span className="transition-colors duration-300 group-hover:text-white">
                  {siteContent.contactPhone}
                </span>
              </div>
              <div className="flex items-center gap-2 group transition-all duration-300 hover:translate-x-2">
                <Mail className="w-4 h-4 flex-shrink-0 transition-all duration-300 group-hover:text-green-300 group-hover:scale-110" />
                <span className="transition-colors duration-300 group-hover:text-white">
                  {siteContent.contactEmail}
                </span>
              </div>
            </div>
          </div>

          {/* Social Media with slide-in animation */}
          <div className={`transform transition-all duration-700 delay-400 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            <h3 className="font-semibold mb-4 transition-colors duration-300 hover:text-green-200">
              Follow Us
            </h3>
            <div className="flex gap-4">
              <a
                href={siteContent.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-green-800 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:shadow-lg group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
              </a>
              <a
                href={siteContent.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-green-800 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:shadow-lg group"
                aria-label="YouTube"
                style={{ animationDelay: '0.1s' }}
              >
                <Youtube className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
              </a>
              <a
                href={siteContent.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-green-800 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:shadow-lg group"
                aria-label="Instagram"
                style={{ animationDelay: '0.2s' }}
              >
                <Instagram className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright with fade-in animation */}
        <div className={`border-t border-green-800 mt-8 pt-8 text-center text-sm text-green-100 transform transition-all duration-700 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`}>
          <p className="transition-colors duration-300 hover:text-white">
            © {new Date().getFullYear()} Devasahayam Mount Shrine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
