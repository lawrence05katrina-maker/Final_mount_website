import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useShrineData } from '../context/ShrineDataContext';
import { livestreamApi } from '../../api/livestreamApi';
import { 
  Radio, 
  Clock, 
  Calendar, 
  Users, 
  Play, 
  Volume2, 
  Maximize, 
  Share2,
  Bell,
  Heart,
  MessageCircle,
  Eye,
  ExternalLink
} from 'lucide-react';
import { QuickNotifyButton } from '../components/StreamEmailNotification';

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
  max_viewers: number;
}

// Default mass timings to show immediately
const DEFAULT_MASS_TIMINGS = [
  { name: 'Morning Mass', time: '6:00 AM', type: 'daily' },
  { name: 'Evening Mass', time: '6:30 PM', type: 'daily' },
  { name: 'Sunday Mass', time: '9:00 AM', type: 'sunday' }
];

const DEFAULT_SPECIAL_EVENTS = [
  { name: 'Feast Day Celebration', date: 'January 14th - Full Day Coverage' },
  { name: 'Friday Adoration', date: 'Every Friday at 7:00 PM' },
  { name: 'Holy Week Services', date: 'Special extended coverage' }
];

// Helper function to convert YouTube URL to proper embed URL
const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return '';
  
  // If it's already an embed URL, return as is
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Extract video ID from various YouTube URL formats
  let videoId = '';
  
  // Handle youtube.com/watch?v=VIDEO_ID
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1]?.split('&')[0];
  }
  // Handle youtu.be/VIDEO_ID
  else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  }
  // Handle youtube.com/live/VIDEO_ID
  else if (url.includes('youtube.com/live/')) {
    videoId = url.split('live/')[1]?.split('?')[0];
  }
  
  if (videoId) {
    // Return proper embed URL with necessary parameters for live streaming
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&showinfo=1&rel=0&modestbranding=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0`;
  }
  
  return url;
};

// Helper function to get YouTube video ID from URL
const getYouTubeVideoId = (url: string): string => {
  if (!url) return '';
  
  let videoId = '';
  
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1]?.split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com/live/')) {
    videoId = url.split('live/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('embed/')[1]?.split('?')[0];
  }
  
  return videoId;
};
export const LiveStreamPage: React.FC = () => {
  const { siteContent } = useShrineData();
  const [activeStream, setActiveStream] = useState<LivestreamData | null>(null);
  const [upcomingStreams, setUpcomingStreams] = useState<LivestreamData[]>([]);
  const [recentStreams, setRecentStreams] = useState<LivestreamData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations on mount
    setIsVisible(true);
  }, []);

  // Share functionality
  const handleShare = useCallback((stream: LivestreamData) => {
    const videoId = getYouTubeVideoId(stream.stream_url);
    const shareUrl = videoId ? `https://youtu.be/${videoId}` : stream.stream_url;
    
    if (navigator.share) {
      navigator.share({
        title: stream.title,
        text: `Watch live: ${stream.title}`,
        url: shareUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  }, []);

  // Open YouTube in new tab for full features
  const openInYouTube = useCallback((stream: LivestreamData) => {
    const videoId = getYouTubeVideoId(stream.stream_url);
    const youtubeUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : stream.stream_url;
    window.open(youtubeUrl, '_blank');
  }, []);

  // Memoize format functions to prevent recreation
  const formatDateTime = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }, []);

  const formatTime = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }, []);

  const getTimeUntilStream = useCallback((scheduledAt: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    const diff = scheduled.getTime() - now.getTime();
    
    if (diff <= 0) return 'Starting now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `Starts in ${hours}h ${minutes}m`;
    }
    return `Starts in ${minutes}m`;
  }, []);

  // Fetch data function
  const fetchLivestreamData = useCallback(async () => {
    if (loading) return; // Prevent multiple simultaneous requests
    
    try {
      setLoading(true);
      
      // Fetch all data in parallel for better performance
      const [activeResponse, upcomingResponse, recentResponse] = await Promise.allSettled([
        livestreamApi.getActive(),
        livestreamApi.getUpcoming(),
        livestreamApi.getRecent(6)
      ]);

      // Handle active stream
      if (activeResponse.status === 'fulfilled' && activeResponse.value.success) {
        setActiveStream(activeResponse.value.data);
      }

      // Handle upcoming streams
      if (upcomingResponse.status === 'fulfilled' && upcomingResponse.value.success) {
        setUpcomingStreams(upcomingResponse.value.data);
      }

      // Handle recent streams
      if (recentResponse.status === 'fulfilled' && recentResponse.value.success) {
        setRecentStreams(recentResponse.value.data);
      }

      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching livestream data:', error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Refresh active stream only
  const refreshActiveStream = useCallback(async () => {
    try {
      const activeResponse = await livestreamApi.getActive();
      if (activeResponse.success) {
        setActiveStream(activeResponse.data);
      }
    } catch (error) {
      console.error('Error refreshing active stream:', error);
    }
  }, []);

  useEffect(() => {
    // Initial load with small delay to let page render
    const timer = setTimeout(fetchLivestreamData, 100);

    // Refresh active stream data every 30 seconds
    const interval = setInterval(refreshActiveStream, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fetchLivestreamData, refreshActiveStream]);

  // Memoize YouTube URL
  const youtubeUrl = useMemo(() => {
    return siteContent?.youtubeUrl || 'https://www.youtube.com/@devasahayammountshrine5677';
  }, [siteContent?.youtubeUrl]);

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`flex items-center justify-center gap-3 mb-6 ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
            <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-full animate-float">
              <Radio className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-800 to-blue-800 bg-clip-text text-transparent">
              Live Mass Stream
            </h1>
          </div>
          <p className={`text-gray-700 max-w-2xl mx-auto text-lg ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`}>
            Join us for live streaming of Holy Mass and special ceremonies from Devasahayam Mount Shrine
          </p>
          {loading && !dataLoaded && (
            <div className={`mt-2 text-sm text-green-600 ${isVisible ? 'animate-fadeInUp stagger-3' : 'opacity-0'}`}>Loading stream information...</div>
          )}
        </div>

        {/* Active Stream Section */}
        {activeStream ? (
          <div className={`mb-12 ${isVisible ? 'animate-scaleIn stagger-1' : 'opacity-0'}`}>
            <div className="flex items-center gap-2 mb-6">
              <Badge className="bg-red-600 text-white px-3 py-1 text-sm font-medium animate-pulse-custom">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
                LIVE NOW
              </Badge>
              <div className="flex items-center gap-1 text-gray-600">
                <Users className="w-4 h-4" />
                <span>{activeStream.viewer_count} watching</span>
              </div>
            </div>

            <Card className="border-2 border-red-200 shadow-2xl overflow-hidden card-hover">
              <CardContent className="p-0">
                {/* Video Player */}
                <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'aspect-video'}`}>
                  <iframe
                    src={getYouTubeEmbedUrl(activeStream.stream_url)}
                    title={activeStream.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                  
                  {/* Enhanced Video Controls Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black bg-opacity-70 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-white text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span>LIVE</span>
                      </div>
                      <div className="flex items-center gap-1 text-white text-sm">
                        <Users className="w-4 h-4" />
                        <span>{activeStream.viewer_count}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white hover:bg-white hover:bg-opacity-20"
                        onClick={() => handleShare(activeStream)}
                        title="Share stream"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white hover:bg-white hover:bg-opacity-20"
                        onClick={() => openInYouTube(activeStream)}
                        title="Open in YouTube (for chat and full features)"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white hover:bg-white hover:bg-opacity-20"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        title="Toggle fullscreen"
                      >
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Stream Info */}
                <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeStream.title}</h2>
                      {activeStream.description && (
                        <p className="text-gray-700 mb-3">{activeStream.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Started {activeStream.started_at ? formatTime(activeStream.started_at) : 'recently'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>Peak: {activeStream.max_viewers} viewers</span>
                        </div>
                      </div>
                      
                      {/* YouTube Features Notice */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-800">
                          <strong>💡 Tip:</strong> Click "Chat on YouTube" or "Full Features" to access live chat, 
                          super chat, and all YouTube interactive features!
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => handleShare(activeStream)}
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => openInYouTube(activeStream)}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Chat on YouTube
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => openInYouTube(activeStream)}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Full Features
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* No Active Stream */
          <div className={`mb-12 ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`}>
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50 card-hover">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                  <Radio className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Live Stream Currently</h3>
                <p className="text-gray-600 mb-4">Check back during mass times or special events</p>
                <QuickNotifyButton 
                  streamTitle="Live Mass Streams" 
                  streamTime="Get notified when we go live"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upcoming Streams */}
        {upcomingStreams.length > 0 && (
          <div className={`mb-12 ${isVisible ? 'animate-slideInLeft stagger-1' : 'opacity-0'}`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-green-600 animate-float" />
              Upcoming Streams
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingStreams.map((stream, index) => (
                <Card key={stream.id} className={`border-green-200 hover:shadow-lg transition-shadow card-hover ${isVisible ? `animate-scaleIn stagger-${index + 2}` : 'opacity-0'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{stream.title}</h3>
                        {stream.description && (
                          <p className="text-sm text-gray-600 mb-3">{stream.description}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="border-green-200 text-green-700">
                        {stream.scheduled_at ? getTimeUntilStream(stream.scheduled_at) : 'Soon'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{stream.scheduled_at ? formatDateTime(stream.scheduled_at) : 'Time TBA'}</span>
                        </div>
                      </div>
                      <QuickNotifyButton 
                        streamTitle={stream.title}
                        streamTime={stream.scheduled_at ? formatDateTime(stream.scheduled_at) : 'Time TBA'}
                        className="text-sm h-8 px-3 border-green-200 text-green-700 hover:bg-green-50 bg-transparent border"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Mass Timings */}
        <div className={`grid md:grid-cols-2 gap-6 mb-12 ${isVisible ? 'animate-slideInRight stagger-1' : 'opacity-0'}`}>
          <Card className="border-green-200 card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Clock className="w-5 h-5 animate-float" />
                Daily Mass Timings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DEFAULT_MASS_TIMINGS.map((mass, index) => (
                  <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${
                    mass.type === 'sunday' ? 'bg-blue-50' : 'bg-green-50'
                  }`}>
                    <span className="text-gray-700 font-medium">{mass.name}</span>
                    <Badge variant="outline" className={`${
                      mass.type === 'sunday' ? 'border-blue-200 text-blue-700' : 'border-green-200 text-green-700'
                    }`}>
                      {mass.time}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Calendar className="w-5 h-5 animate-float" style={{animationDelay: '0.5s'}} />
                Special Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DEFAULT_SPECIAL_EVENTS.map((event, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-gray-900 mb-1">{event.name}</p>
                    <p className="text-sm text-gray-600">{event.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Streams */}
        {recentStreams.length > 0 && (
          <div className={`mb-12 ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Play className="w-6 h-6 text-green-600 animate-pulse-custom" />
              Recent Streams
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recentStreams.map((stream, index) => (
                <Card key={stream.id} className={`border-green-200 hover:shadow-lg transition-shadow group card-hover ${isVisible ? `animate-scaleIn stagger-${index + 3}` : 'opacity-0'}`}>
                  <CardContent className="p-0">
                    {stream.thumbnail_url ? (
                      <div className="relative aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={stream.thumbnail_url}
                          alt={stream.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center rounded-t-lg">
                        <Radio className="w-12 h-12 text-green-600" />
                      </div>
                    )}
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{stream.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{stream.max_viewers} views</span>
                        </div>
                        <span>{stream.started_at ? formatTime(stream.started_at) : 'Recently'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* YouTube Channel Link */}
        <Card className={`border-green-200 bg-gradient-to-r from-green-50 to-blue-50 card-hover ${isVisible ? 'animate-scaleIn stagger-1' : 'opacity-0'}`}>
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Visit Our YouTube Channel
            </h3>
            <p className="text-gray-700 mb-6">
              Subscribe to our channel for notifications about upcoming streams and access to recorded masses
            </p>
            <Button asChild className="bg-red-600 hover:bg-red-700 animate-pulse-custom">
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit YouTube Channel
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className={`border-green-200 bg-green-50 mt-8 card-hover ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`}>
          <CardContent className="pt-6">
            <h4 className="text-green-800 mb-4 font-semibold">Important Information</h4>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                Live streaming is available during scheduled mass times
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                For full YouTube features (live chat, super chat, reactions), click "Chat on YouTube" or "Full Features"
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                Check our YouTube channel for recorded masses if you miss the live stream
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                For special ceremonies and feast day celebrations, check our announcements
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                You can participate in prayers and responses from wherever you are
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                Feel free to leave your prayer intentions in the YouTube live chat
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                Use the share button to invite family and friends to join the live mass
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};