import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Radio, Clock, Users, Play } from 'lucide-react';
import { livestreamApi } from '../../api/livestreamApi';

interface LivestreamData {
  id: number;
  title: string;
  description?: string;
  stream_url: string;
  thumbnail_url?: string;
  is_active: boolean;
  is_scheduled: boolean;
  scheduled_at?: string;
  started_at?: string;
  viewer_count: number;
}

export const LivestreamNotification: React.FC = () => {
  const [activeStream, setActiveStream] = useState<LivestreamData | null>(null);
  const [upcomingStream, setUpcomingStream] = useState<LivestreamData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkLivestreams = async () => {
      try {
        // Check for active livestream
        const activeResponse = await livestreamApi.getActive();
        if (activeResponse.success && activeResponse.data) {
          setActiveStream(activeResponse.data);
          setIsVisible(true);
          return;
        }

        // Check for upcoming livestream (within next 30 minutes)
        const upcomingResponse = await livestreamApi.getUpcoming();
        if (upcomingResponse.success && upcomingResponse.data.length > 0) {
          const nextStream = upcomingResponse.data[0];
          const scheduledTime = new Date(nextStream.scheduled_at);
          const now = new Date();
          const timeDiff = scheduledTime.getTime() - now.getTime();
          const minutesDiff = Math.floor(timeDiff / (1000 * 60));

          // Show notification if stream is within 30 minutes
          if (minutesDiff <= 30 && minutesDiff > 0) {
            setUpcomingStream(nextStream);
            setIsVisible(true);
          }
        }
      } catch (error) {
        console.error('Error checking livestreams:', error);
      }
    };

    // Check immediately
    checkLivestreams();

    // Check every 30 seconds
    const interval = setInterval(checkLivestreams, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!isVisible || isDismissed || (!activeStream && !upcomingStream)) {
    return null;
  }

  const currentStream = activeStream || upcomingStream;
  const isLive = !!activeStream;

  if (!currentStream) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 md:top-4 md:bottom-auto z-50 w-64 md:max-w-sm">
      {/* Mobile Design - Compact Pill Style */}
      <div className="md:hidden bg-white rounded-full shadow-2xl border border-gray-200 overflow-hidden animate-slide-in-right mobile-notification-pill">
        <div className="flex items-center p-2">
          {/* Live Indicator */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white ${isLive ? 'bg-red-600' : 'bg-green-600'}`}>
            {isLive ? (
              <>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                <span>LIVE</span>
              </>
            ) : (
              <>
                <Clock className="w-2.5 h-2.5" />
                <span>SOON</span>
              </>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 px-2 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">
              {currentStream.title}
            </p>
            {isLive && (
              <p className="text-xs text-gray-500">
                {currentStream.viewer_count} watching
              </p>
            )}
          </div>
          
          {/* Action Button */}
          <Link
            to="/livestream"
            className={`px-3 py-1 rounded-full text-xs font-medium text-white transition-all ${
              isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLive ? 'Watch' : 'Join'}
          </Link>
          
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="ml-1 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Desktop Design - Original Card Style */}
      <div className="hidden md:block bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-slide-in-right mobile-notification">
        {/* Header */}
        <div className={`px-4 py-3 ${isLive ? 'bg-red-600' : 'bg-green-600'} text-white relative`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isLive ? (
                <>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <Radio className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm">LIVE NOW</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold text-sm">STARTING SOON</span>
                </>
              )}
            </div>
            <button
              onClick={handleDismiss}
              className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white hover:bg-opacity-20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Thumbnail */}
          {currentStream.thumbnail_url && (
            <div className="relative mb-3 rounded-lg overflow-hidden shadow-sm">
              <img
                src={currentStream.thumbnail_url}
                alt={currentStream.title}
                className="w-full h-32 object-cover transition-transform duration-300 hover:scale-105"
              />
              {isLive && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="bg-white bg-opacity-20 rounded-full p-2">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base leading-tight">
            {currentStream.title}
          </h3>

          {/* Description */}
          {currentStream.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {currentStream.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            {isLive ? (
              <>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{currentStream.viewer_count} watching</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Started {currentStream.started_at ? formatTime(currentStream.started_at) : 'recently'}</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Starts at {currentStream.scheduled_at ? formatTime(currentStream.scheduled_at) : 'soon'}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Link
            to="/livestream"
            className={`block w-full text-center py-2 px-4 rounded-lg font-medium transition-all duration-300 text-sm transform hover:scale-105 active:scale-95 ${
              isLive
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-200'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-200'
            }`}
          >
            {isLive ? 'Watch Live' : 'Set Reminder'}
          </Link>
        </div>
      </div>
    </div>
  );
};

// CSS for animation (add to your global CSS)
const styles = `
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-in-bottom-right {
  from {
    transform: translate(100%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(0, 0);
    opacity: 1;
  }
}

@keyframes bounce-in {
  0% {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
  60% {
    transform: translateX(-10px) scale(1.05);
    opacity: 1;
  }
  80% {
    transform: translateX(5px) scale(0.98);
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes bounce-in-mobile {
  0% {
    transform: translate(100%, 100%) scale(0.8);
    opacity: 0;
  }
  60% {
    transform: translate(-10px, -10px) scale(1.05);
    opacity: 1;
  }
  80% {
    transform: translate(5px, 5px) scale(0.98);
  }
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.4s ease-out;
}

.mobile-notification {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-notification:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.mobile-notification-pill {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 280px;
  width: 280px;
}

.mobile-notification-pill:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.mobile-notification-pill:active {
  transform: scale(0.98);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Mobile-specific styles for pill design */
@media (max-width: 768px) {
  .mobile-notification-pill {
    animation: bounce-in-mobile 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    margin-right: 8px;
    margin-bottom: 8px;
  }
}

/* Desktop styles */
@media (min-width: 769px) {
  .mobile-notification {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}

/* Extra small mobile devices */
@media (max-width: 480px) {
  .mobile-notification-pill {
    max-width: 260px !important;
    width: 260px;
    margin-right: 6px;
    margin-bottom: 6px;
  }
}

/* Very small screens */
@media (max-width: 360px) {
  .mobile-notification-pill {
    max-width: 240px !important;
    width: 240px;
  }
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .animate-slide-in-right,
  .mobile-notification-pill {
    animation: none;
    transform: translate(0, 0);
    opacity: 1;
  }
  
  .mobile-notification:hover,
  .mobile-notification-pill:hover {
    transform: none;
  }
}
`;