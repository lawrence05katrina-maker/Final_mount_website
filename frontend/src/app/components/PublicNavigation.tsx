import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Church } from 'lucide-react';
import { Button } from './ui/button';

export const PublicNavigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/mass-booking', label: 'Mass Booking' },
    { path: '/donations', label: 'Donations' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/livestream', label: 'Live Stream' },
    { path: '/testimonies', label: 'Testimonies' },
    { path: '/prayer-request', label: 'Prayer Request' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-lg bg-white/95 backdrop-blur-md' : 'shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with gentle glow effect */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <Church className="w-8 h-8 text-green-700 transition-all duration-500 group-hover:text-green-600 group-hover:drop-shadow-lg" />
              {/* Gentle glow effect */}
              <div className="absolute inset-0 w-8 h-8 bg-green-300 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-all duration-500"></div>
            </div>
            <span className="font-semibold text-green-800 transition-all duration-300 group-hover:text-green-600">
              Devasahayam Mount Shrine
            </span>
          </Link>

          {/* Desktop Navigation with underline animation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
                  isActive(item.path)
                    ? 'text-green-700'
                    : 'text-gray-700 hover:text-green-700'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                
                {/* Animated underline */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 transform origin-left transition-all duration-300 ${
                  isActive(item.path) 
                    ? 'scale-x-100' 
                    : 'scale-x-0 group-hover:scale-x-100'
                }`}></div>
                
                {/* Subtle background on hover */}
                <div className="absolute inset-0 bg-green-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>

          {/* Mobile menu button with clean animation */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-green-700 hover:bg-green-50 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 flex flex-col justify-center space-y-1.5">
                <span className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}></span>
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}></span>
              </div>
            </div>
          </button>
        </div>

        {/* Mobile Navigation with smooth slide */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 border-t border-gray-200 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-green-700 bg-green-50 border-l-4 border-green-600'
                    : 'text-gray-700 hover:text-green-700 hover:bg-green-50 hover:pl-6'
                }`}
                style={{
                  transitionDelay: mobileMenuOpen ? `${index * 30}ms` : '0ms'
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};