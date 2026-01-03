import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LivestreamNotification } from '../components/LivestreamNotification';
import { useShrineData } from '../context/ShrineDataContext';
import { Calendar, Heart, Send } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { siteContent, announcements } = useShrineData();
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use public folder paths for church images
  const churchImages = [
    '/church1.jpg',
    '/church2.jpg',
    '/church3.jpg',
    '/church4.jpg'
  ];

  useEffect(() => {
    // Trigger animations on mount
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Auto-scroll through church images
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % churchImages.length
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [churchImages.length]);

  return (
    <div className="min-h-screen">
      {/* Premium Animation Styles */}
      <style>{`
        @keyframes premiumFadeInUp {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.95);
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes premiumSlideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-80px) rotateY(-15deg);
            filter: blur(3px);
          }
          100% {
            opacity: 1;
            transform: translateX(0) rotateY(0deg);
            filter: blur(0);
          }
        }

        @keyframes premiumSlideInRight {
          0% {
            opacity: 0;
            transform: translateX(80px) rotateY(15deg);
            filter: blur(3px);
          }
          100% {
            opacity: 1;
            transform: translateX(0) rotateY(0deg);
            filter: blur(0);
          }
        }

        @keyframes premiumScaleIn {
          0% {
            opacity: 0;
            transform: scale(0.7) rotate(-5deg);
            filter: blur(5px);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05) rotate(2deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
            filter: blur(0);
          }
        }

        @keyframes premiumFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-8px) rotate(1deg);
          }
          50% {
            transform: translateY(-15px) rotate(0deg);
          }
          75% {
            transform: translateY(-8px) rotate(-1deg);
          }
        }

        @keyframes premiumPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 0 0 15px rgba(34, 197, 94, 0);
          }
        }

        @keyframes premiumGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.3), 0 0 40px rgba(34, 197, 94, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.3);
          }
        }

        @keyframes premiumShimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes premiumBounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-100px) rotate(-180deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.1) translateY(-20px) rotate(-90deg);
          }
          70% {
            transform: scale(0.95) translateY(10px) rotate(-30deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0) rotate(0deg);
          }
        }

        @keyframes premiumSlideUp {
          0% {
            opacity: 0;
            transform: translateY(100px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .premium-fadeInUp {
          animation: premiumFadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .premium-slideInLeft {
          animation: premiumSlideInLeft 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .premium-slideInRight {
          animation: premiumSlideInRight 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .premium-scaleIn {
          animation: premiumScaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .premium-bounceIn {
          animation: premiumBounceIn 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .premium-slideUp {
          animation: premiumSlideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .premium-float {
          animation: premiumFloat 4s ease-in-out infinite;
        }

        .premium-pulse {
          animation: premiumPulse 2.5s ease-in-out infinite;
        }

        .premium-glow {
          animation: premiumGlow 3s ease-in-out infinite;
        }

        .premium-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          background-size: 200% 100%;
          animation: premiumShimmer 2.5s infinite;
        }

        .premium-stagger-1 { animation-delay: 0.1s; }
        .premium-stagger-2 { animation-delay: 0.3s; }
        .premium-stagger-3 { animation-delay: 0.5s; }
        .premium-stagger-4 { animation-delay: 0.7s; }
        .premium-stagger-5 { animation-delay: 0.9s; }
        .premium-stagger-6 { animation-delay: 1.1s; }

        .premium-card-hover {
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-style: preserve-3d;
        }

        .premium-card-hover:hover {
          transform: translateY(-15px) rotateX(5deg) rotateY(5deg) scale(1.03);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 0 30px rgba(34, 197, 94, 0.2);
        }

        .premium-hero-bg {
          background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(34,197,94,0.3) 50%, rgba(0,0,0,0.6) 100%);
          backdrop-filter: blur(2px);
        }

        .premium-text-glow {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3);
        }

        /* Enhanced Glass Effect Styles */
        .glass-container {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 25px 45px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset,
            0 1px 0 rgba(255, 255, 255, 0.2) inset;
          position: relative;
          overflow: hidden;
        }

        .glass-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: glass-shimmer 3s infinite;
        }

        .glass-text {
          position: relative;
          z-index: 2;
          text-shadow: 
            0 0 30px rgba(255, 255, 255, 0.8),
            0 0 60px rgba(255, 255, 255, 0.4),
            0 2px 4px rgba(0, 0, 0, 0.3);
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(255, 255, 255, 1) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        @keyframes glass-shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        /* Floating glass particles */
        .glass-container::after {
          content: '';
          position: absolute;
          top: 10%;
          right: 10%;
          width: 60px;
          height: 60px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 70%
          );
          border-radius: 50%;
          animation: premiumFloat 4s ease-in-out infinite;
          animation-delay: 1s;
        }

        .glass-subtitle {
          position: relative;
          z-index: 2;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
          opacity: 0.95;
        }

        .glass-buttons {
          position: relative;
          z-index: 2;
        }

        .glass-buttons .bg-green-700 {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(21, 128, 61, 0.9)) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .glass-buttons .bg-white {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7)) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        /* Glass particles */
        .glass-particle {
          position: absolute;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            transparent 100%
          );
          border-radius: 50%;
          animation: premiumFloat 6s ease-in-out infinite;
        }

        .glass-particle-1 {
          width: 80px;
          height: 80px;
          top: 15%;
          left: 10%;
          animation-delay: 0s;
        }

        .glass-particle-2 {
          width: 120px;
          height: 120px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .glass-particle-3 {
          width: 60px;
          height: 60px;
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        .glass-particle-4 {
          width: 100px;
          height: 100px;
          top: 30%;
          right: 30%;
          animation-delay: 1s;
        }

        .glass-particle-5 {
          width: 70px;
          height: 70px;
          bottom: 40%;
          right: 10%;
          animation-delay: 3s;
        }

        .premium-text-glow {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3);
        }

        .premium-floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .premium-particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: premiumFloat 6s ease-in-out infinite;
        }

        .premium-particle:nth-child(1) { width: 4px; height: 4px; left: 10%; animation-delay: 0s; }
        .premium-particle:nth-child(2) { width: 6px; height: 6px; left: 20%; animation-delay: 1s; }
        .premium-particle:nth-child(3) { width: 3px; height: 3px; left: 30%; animation-delay: 2s; }
        .premium-particle:nth-child(4) { width: 5px; height: 5px; left: 40%; animation-delay: 3s; }
        .premium-particle:nth-child(5) { width: 4px; height: 4px; left: 50%; animation-delay: 4s; }
        .premium-particle:nth-child(6) { width: 6px; height: 6px; left: 60%; animation-delay: 5s; }
        .premium-particle:nth-child(7) { width: 3px; height: 3px; left: 70%; animation-delay: 0.5s; }
        .premium-particle:nth-child(8) { width: 5px; height: 5px; left: 80%; animation-delay: 1.5s; }
        .premium-particle:nth-child(9) { width: 4px; height: 4px; left: 90%; animation-delay: 2.5s; }

        /* Floating Action Buttons */
        .floating-buttons {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .floating-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation: premiumFloat 3s ease-in-out infinite;
          backdrop-filter: blur(10px);
        }

        .floating-btn:hover {
          transform: scale(1.15) translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
        }

        .floating-btn.whatsapp {
          background: linear-gradient(135deg, #25D366, #128C7E);
          animation-delay: 0.2s;
        }

        .floating-btn.phone {
          background: linear-gradient(135deg, #007bff, #0056b3);
          animation-delay: 0.4s;
        }

        .floating-btn.prayer {
          background: linear-gradient(135deg, #6f42c1, #5a2d91);
          animation-delay: 0.6s;
        }

        .floating-btn.donation {
          background: linear-gradient(135deg, #dc3545, #c82333);
          animation-delay: 0.8s;
        }

        .floating-btn.mass {
          background: linear-gradient(135deg, #28a745, #1e7e34);
          animation-delay: 1s;
        }

        @media (max-width: 768px) {
          .floating-buttons {
            right: 15px;
            bottom: 15px;
            gap: 12px;
          }
          
          .floating-btn {
            width: 50px;
            height: 50px;
          }
        }

        .premium-button-hover {
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
        }

        .premium-button-hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s;
        }

        .premium-button-hover:hover::before {
          left: 100%;
        }

        .premium-button-hover:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
        }
      `}</style> 
      {/* Livestream Notification */}
      <LivestreamNotification />


      {/* Hero Section */}
      <div
        className="relative h-[500px] bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${churchImages[currentImageIndex]})`,
        }}
      >
       
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          {/* Glass particles background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="glass-particle glass-particle-1"></div>
            <div className="glass-particle glass-particle-2"></div>
            <div className="glass-particle glass-particle-3"></div>
            <div className="glass-particle glass-particle-4"></div>
            <div className="glass-particle glass-particle-5"></div>
          </div>
          
          <div className={`max-w-4xl glass-container rounded-3xl p-10 ${isVisible ? 'premium-fadeInUp premium-stagger-1' : 'opacity-0'}`}>
            <h1 className={`text-white text-4xl md:text-5xl lg:text-6xl mb-4 premium-text-glow glass-text ${isVisible ? 'premium-slideInLeft premium-stagger-2' : 'opacity-0'}`}>
              {siteContent.heroTitle}
            </h1>
            <p className={`text-white text-lg md:text-xl mb-8 glass-subtitle ${isVisible ? 'premium-slideInRight premium-stagger-3' : 'opacity-0'}`}>
              {siteContent.heroSubtitle}
            </p>
            <div className={`flex flex-wrap gap-4 justify-center glass-buttons ${isVisible ? 'premium-scaleIn premium-stagger-4' : 'opacity-0'}`}>
              <Button
                size="lg"
                asChild
                className="bg-green-700 hover:bg-green-800 premium-glow premium-pulse premium-button-hover"
              >
                <Link to="/mass-booking">
                  <Calendar className="mr-2 w-5 h-5" />
                  Book Mass
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-white text-green-700 border-white hover:bg-green-50 premium-glow premium-pulse premium-button-hover"
              >
                <Link to="/donations">
                  <Heart className="mr-2 w-5 h-5" />
                  Donate
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-white text-green-700 border-white hover:bg-green-50 premium-glow premium-pulse premium-button-hover"
              >
                <Link to="/prayer-request">
                  <Send className="mr-2 w-5 h-5" />
                  Prayer Request
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`${isVisible ? 'premium-slideInLeft premium-stagger-1' : 'opacity-0'}`}>
            <h2 className="text-green-800 mb-4">About Saint Devasahayam</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {siteContent.aboutShort}
            </p>
            <Button
              variant="outline"
              asChild
              className="border-green-700 text-green-700 hover:bg-green-700 hover:text-white premium-glow premium-pulse premium-button-hover"
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
          <div className={`rounded-lg overflow-hidden shadow-lg premium-card-hover ${isVisible ? 'premium-slideInRight premium-stagger-2' : 'opacity-0'}`}>
            <img
              src="https://images.unsplash.com/photo-1758960291769-43a13dd65822?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWludCUyMHN0YXR1ZSUyMHJlbGlnaW91cyUyMHNocmluZXxlbnwxfHx8fDE3NjYzNzg4Njd8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Saint Devasahayam"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Management Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-semibold text-green-800 mb-10 ${isVisible ? 'premium-fadeInUp premium-stagger-1' : 'opacity-0'}`}>Management</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <Card className={`border-0 hover:shadow-lg transition-shadow premium-card-hover ${isVisible ? 'premium-fadeInUp premium-stagger-2' : 'opacity-0'}`}>
              <img
                src="src/app/pages/Assets/leon_henson.jpg"
                alt="Rev. Fr. S. Leon Henson"
                className="w-full h-56 object-cover rounded-t-lg"
              />
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg">Rev. Fr. S. Leon Henson</h3>
                <p className="text-sm text-gray-500 mb-3">Parish Priest</p>
                <p className="text-sm text-gray-600">Rev. Fr. S. Leon Henson serves as the dedicated Parish Priest, leading the congregation with spiritual guidance and pastoral care.</p>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className={`border-0 hover:shadow-lg transition-shadow premium-card-hover ${isVisible ? 'premium-fadeInUp premium-stagger-3' : 'opacity-0'}`}>
              <img
                src="src/app/pages/Assets/mr.siluvai_dhasan.jpg"
                alt="Mr. Siluvai Dhasan"
                className="w-full h-56 object-cover rounded-t-lg"
              />
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg">Mr. Siluvai Dhasan</h3>
                <p className="text-sm text-gray-500 mb-3">Vice President</p>
                <p className="text-sm text-gray-600">Mr. Siluvai Dhasan is the Vice President of the parish council, ensuring effective administration and community engagement.</p>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className={`border-0 hover:shadow-lg transition-shadow premium-card-hover ${isVisible ? 'premium-fadeInUp premium-stagger-4' : 'opacity-0'}`}>
              <img
                src="src/app/pages/Assets/mr.david.jpg"
                alt="Mr. David"
                className="w-full h-56 object-cover rounded-t-lg"
              />
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg">Mr. David</h3>
                <p className="text-sm text-gray-500 mb-3">Secretary</p>
                <p className="text-sm text-gray-600">Mr. David serves as the Secretary, overseeing communications and ensuring smooth coordination of parish activities.</p>
              </CardContent>
            </Card>

            {/* Card 4 */}
            <Card className={`border-0 hover:shadow-lg transition-shadow premium-card-hover ${isVisible ? 'premium-fadeInUp premium-stagger-5' : 'opacity-0'}`}>
              <div className="w-full h-56 flex items-center justify-center bg-gray-200 rounded-t-lg">
                <span className="text-gray-500">No Image</span>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg">Janate</h3>
                <p className="text-sm text-gray-500 mb-3">Treasurer</p>
                <p className="text-sm text-gray-600">Janate is the Treasurer, responsible for managing the parish's finances and ensuring transparency in fiscal matters.</p>
              </CardContent>
            </Card>
          </div>
          <div className={`mt-10 ${isVisible ? 'premium-slideUp premium-stagger-6' : 'opacity-0'}`}>
            <Button
              variant="outline"
              className="border-green-700 text-green-700 hover:bg-green-700 hover:text-white premium-glow premium-pulse premium-button-hover"
              asChild
            >
              <Link to="/fathers">View More...</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <div className="bg-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex items-center gap-2 mb-8 ${isVisible ? 'premium-slideInLeft premium-stagger-1' : 'opacity-0'}`}>
              <h2 className="text-green-800">Important Announcements</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {announcements.slice(0, 4).map((announcement, index) => (
                <Card key={announcement.id} className={`border-blue-200 premium-card-hover ${isVisible ? `premium-scaleIn premium-stagger-${index + 2}` : 'opacity-0'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{announcement.title}</span>
                      {announcement.priority === 'high' && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Important
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{announcement.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(announcement.date).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Call to Action Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Link to="/mass-booking">
            <Card className={`text-center border-blue-200 hover:shadow-lg transition-shadow cursor-pointer premium-card-hover ${isVisible ? 'premium-scaleIn premium-stagger-1' : 'opacity-0'}`}>
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 premium-float">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Book a Mass</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Book a Holy Mass for your intentions and loved ones
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/donations">
            <Card className={`text-center border-blue-200 hover:shadow-lg transition-shadow cursor-pointer premium-card-hover ${isVisible ? 'premium-scaleIn premium-stagger-2' : 'opacity-0'}`}>
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 premium-float" style={{animationDelay: '0.5s'}}>
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Make a Donation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Support the shrine and its charitable activities
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/prayer-request">
            <Card className={`text-center border-green-200 hover:shadow-lg transition-shadow cursor-pointer premium-card-hover ${isVisible ? 'premium-scaleIn premium-stagger-3' : 'opacity-0'}`}>
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 premium-float" style={{animationDelay: '1s'}}>
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Prayer Request</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Submit your prayer requests to be remembered in our prayers
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};