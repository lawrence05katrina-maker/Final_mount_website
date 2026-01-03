import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import { Button } from '../components/ui/button';
import ContactApi from '../../api/contactApi';

interface ContactInfo {
  id: number;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  map_lat: number;
  map_lng: number;
  office_hours: any;
  mass_timings: any;
  social_media: any;
  transportation_info: any;
}

// Default fallback data to show immediately
const DEFAULT_CONTACT_INFO: ContactInfo = {
  id: 1,
  contact_phone: '+91 89037 60869',
  contact_email: 'devasahayammountshrine@gmail.com',
  contact_address: 'Devasahayam Mount Church, Devasahayam Mount, Aralvaimozhi, Kanyakumari District, Tamil Nadu 629302, India',
  map_lat: 8.3185,
  map_lng: 77.5508,
  office_hours: {
    weekdays: {
      monday_to_saturday: '5:00 AM - 9:00 PM',
      sunday: '5:00 AM - 10:00 PM'
    },
    phone_availability: '8:00 AM - 8:00 PM'
  },
  mass_timings: {
    daily_masses: ['6:00 AM', '9:00 AM', '6:00 PM'],
    special_occasions: {
      feast_day: 'Special masses throughout the day',
      sundays: 'Additional evening mass at 7:30 PM'
    }
  },
  social_media: {
    facebook: 'https://www.facebook.com/Devasahayammountshrine',
    youtube: 'https://www.youtube.com/@devasahayammountshrine5677?si=VMI5LnpVg0_qa_Ud',
    instagram: 'https://www.instagram.com/devasahayammountshrine/?igsh=MXJ1d3N5aXlxcHVuMw%3D%3D'
  },
  transportation_info: {
    by_air: {
      nearest_airport: 'Trivandrum International Airport',
      distance: 'approximately 50 km',
      transport: 'Taxis and buses available from airport'
    },
    by_train: {
      nearest_station: 'Nagercoil Junction',
      distance: 'approximately 15 km',
      transport: 'Local transportation readily available'
    },
    by_road: {
      connectivity: 'Well-connected by state and private buses from major cities. ',
      private_transport: 'Private vehicles and taxis can easily reach the shrine.'
    }
  }
};

export const ContactPage: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(DEFAULT_CONTACT_INFO);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations on mount
    setIsVisible(true);
  }, []);

  // Memoize the map URL to prevent recalculation
  const mapUrl = useMemo(() => {
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.0!2d${contactInfo.map_lng}!3d${contactInfo.map_lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMjknMDcuOCJOIDc3wrAzMCc1Mi4yIkU!5e0!3m2!1sen!2sin!4v1234567890123`;
  }, [contactInfo.map_lat, contactInfo.map_lng]);

  useEffect(() => {
    // Load data in background without blocking UI
    const loadContactInfo = async () => {
      try {
        setLoading(true);
        const response = await ContactApi.getContactInfo();
        
        if (response.success && response.data) {
          setContactInfo(response.data);
          setDataLoaded(true);
        }
      } catch (error) {
        console.error('Error loading contact info:', error);
        // Keep using default data on error
      } finally {
        setLoading(false);
      }
    };

    // Small delay to let the page render first
    const timer = setTimeout(loadContactInfo, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen py-16 px-4 bg-gray-50">

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-green-800 mb-4 ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>Contact Us</h1>
          <p className={`text-gray-700 max-w-2xl mx-auto ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`}>
            Visit us, call us, or reach out for any inquiries. We're here to serve you.
          </p>
          {/* {loading && !dataLoaded && (
            <div className={`mt-2 text-sm text-green-600 ${isVisible ? 'animate-fadeInUp stagger-3' : 'opacity-0'}`}>Updating contact information...</div>
          )} */}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Contact Information */}
          <div className={`space-y-6 ${isVisible ? 'animate-slideInLeft stagger-1' : 'opacity-0'}`}>
            {/* Address */}
            <Card className="border-green-200 card-hover">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 animate-float">
                    <MapPin className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-green-800 mb-2">Address</h3>
                    <p className="text-gray-700">{contactInfo.contact_address}</p>
                    <Button
                      variant="link"
                      className="text-green-700 p-0 h-auto mt-2 animate-pulse-custom"
                      onClick={() => {
                        window.open(
                          `https://www.google.com/maps?q=${contactInfo.map_lat},${contactInfo.map_lng}`,
                          '_blank'
                        );
                      }}
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phone */}
            <Card className="border-green-200 card-hover">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 animate-float" style={{animationDelay: '0.5s'}}>
                    <Phone className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-green-800 mb-2">Phone</h3>
                    <p className="text-gray-700">{contactInfo.contact_phone}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Available: {contactInfo.office_hours?.phone_availability || '8:00 AM - 8:00 PM'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="border-green-200 card-hover">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 animate-float" style={{animationDelay: '1s'}}>
                    <Mail className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-green-800 mb-2">Email</h3>
                    <p className="text-gray-700">{contactInfo.contact_email}</p>
                    <p className="text-sm text-gray-600 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="border-green-200 bg-green-50 card-hover">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-custom">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-green-800 mb-3">Office & Shrine Timings</h3>
                    <div className="space-y-2 text-gray-700 text-sm">
                      <div className="flex justify-between">
                        <span>Monday - Saturday</span>
                        <span>{contactInfo.office_hours?.weekdays?.monday_to_saturday || '5:00 AM - 9:00 PM'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span>{contactInfo.office_hours?.weekdays?.sunday || '5:00 AM - 10:00 PM'}</span>
                      </div>
                      <div className="border-t border-green-200 pt-2 mt-3">
                        <p><strong>Mass Timings:</strong></p>
                        <p>{contactInfo.mass_timings?.daily_masses?.join(', ') || '6:00 AM, 9:00 AM, 6:00 PM'} (Daily)</p>
                        {contactInfo.mass_timings?.special_occasions?.sundays && (
                          <p className="text-xs mt-1">{contactInfo.mass_timings.special_occasions.sundays}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <Card className={`border-green-200 card-hover ${isVisible ? 'animate-slideInRight stagger-2' : 'opacity-0'}`}>
            <CardContent className="p-0">
              <div className="h-full min-h-[500px] rounded-lg overflow-hidden">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '500px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Devasahayam Mount Shrine Location"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How to Reach */}
        <Card className={`border-green-200 mb-8 card-hover ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
          <CardContent className="pt-6">
            <h3 className="text-green-800 mb-6">How to Reach Us</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className={`${isVisible ? 'animate-scaleIn stagger-2' : 'opacity-0'}`}>
                <h4 className="text-green-700 mb-2">By Air</h4>
                <p className="text-sm text-gray-700">
                  {contactInfo.transportation_info?.by_air?.nearest_airport || 'Trivandrum International Airport'} ({contactInfo.transportation_info?.by_air?.distance || 'approximately 50 km away'}). 
                  {contactInfo.transportation_info?.by_air?.transport || 'Taxis and buses are available from the airport.'}
                </p>
              </div>
              <div className={`${isVisible ? 'animate-scaleIn stagger-3' : 'opacity-0'}`}>
                <h4 className="text-green-700 mb-2">By Train</h4>
                <p className="text-sm text-gray-700">
                  {contactInfo.transportation_info?.by_train?.nearest_station || 'Nagercoil Junction'} ({contactInfo.transportation_info?.by_train?.distance || 'approximately 15 km away'}). 
                  {contactInfo.transportation_info?.by_train?.transport || 'Local transportation is readily available.'}
                </p>
              </div>
              <div className={`${isVisible ? 'animate-scaleIn stagger-4' : 'opacity-0'}`}>
                <h4 className="text-green-700 mb-2">By Road</h4>
                <p className="text-sm text-gray-700">
                  {contactInfo.transportation_info?.by_road?.connectivity || 'Well-connected by state and private buses from major cities.'}
                  {contactInfo.transportation_info?.by_road?.private_transport || 'Private vehicles and taxis can easily reach the shrine.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className={`border-green-200 card-hover ${isVisible ? 'animate-scaleIn stagger-2' : 'opacity-0'}`}>
          <CardContent className="pt-6">
            <h3 className="text-green-800 mb-6 text-center">Connect With Us</h3>
            <div className="flex justify-center gap-6">
              <a
                href={contactInfo.social_media?.facebook || 'https://www.facebook.com/Devasahayammountshrine'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-green-50 transition-colors group animate-float"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Facebook</span>
              </a>
              <a
                href={contactInfo.social_media?.youtube || 'https://www.youtube.com/@devasahayammountshrine5677?si=VMI5LnpVg0_qa_Ud'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-green-50 transition-colors group animate-float"
                style={{animationDelay: '0.5s'}}
              >
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-700">YouTube</span>
              </a>
              <a
                href={contactInfo.social_media?.instagram || 'https://www.instagram.com/devasahayammountshrine/?igsh=MXJ1d3N5aXlxcHVuMw%3D%3D'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-green-50 transition-colors group animate-float"
                style={{animationDelay: '1s'}}
              >
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                  <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Instagram</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};