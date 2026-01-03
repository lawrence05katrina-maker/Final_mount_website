import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import GalleryApi from '../../api/galleryApi';
import { 
  Calendar,
  Eye,
  Download,
  Share2,
  AlertCircle,
  RefreshCw,
  Play
} from 'lucide-react';

// Helper function to convert YouTube URL to embed format
const convertToEmbedUrl = (url: string): string => {
  if (!url) return '';
  
  // If already an embed URL, return as is
  if (url.includes('/embed/')) return url;
  
  // Convert YouTube watch URL to embed URL
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Convert YouTube short URL to embed URL
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // For other video URLs, return as is
  return url;
};

// Helper function to get video thumbnail
const getVideoThumbnail = (videoUrl: string): string => {
  // Extract YouTube video ID and get thumbnail
  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    let videoId = '';
    
    if (videoUrl.includes('/embed/')) {
      videoId = videoUrl.split('/embed/')[1]?.split('?')[0];
    } else if (videoUrl.includes('watch?v=')) {
      videoId = videoUrl.split('v=')[1]?.split('&')[0];
    } else if (videoUrl.includes('youtu.be/')) {
      videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
    }
    
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }
  
  // Fallback thumbnail
  return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop';
};

// Helper function to get full image URL
const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return 'https://images.unsplash.com/photo-1758517936201-cb4b8fd39e71?w=400&h=300&fit=crop';
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/uploads')) {
    return `http://localhost:5000${imageUrl}`;
  }
  return imageUrl;
};

// Types
interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  image_name: string;
  category: string;
  is_featured: boolean;
  file_type: string;
  created_at: string;
  type?: 'photo' | 'video'; // Add type for photos/videos
}

interface VideoItem {
  id: number;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  category: string;
  created_at: string;
  duration?: string;
  views?: string;
}

export const GalleryPage: React.FC = () => {
  // State management
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'photos' | 'videos'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | VideoItem | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animation trigger
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Load gallery data
  const loadGalleryData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      // Load gallery items from API
      const response = await GalleryApi.getPublicGallery();

      if (response.success) {
        const items = response.data || [];
        
        // Separate photos and videos
        const photos = items.filter((item: GalleryItem) => item.file_type !== 'video').map((item: GalleryItem) => ({
          ...item,
          type: 'photo' as const
        }));
        
        const videos = items.filter((item: any) => item.file_type === 'video').map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          video_url: convertToEmbedUrl(item.image_url), // Convert to embed URL
          thumbnail_url: getVideoThumbnail(item.image_url), // Get YouTube thumbnail
          category: item.category,
          created_at: item.created_at,
          duration: '0:00', // Default duration, can be enhanced later
          views: '0' // Default views, can be enhanced later
        }));
        
        setGalleryItems(photos);
        setVideoItems(videos);
      } else {
        throw new Error(response.message || 'Failed to load gallery');
      }

      setRetryCount(0);
    } catch (err) {
      console.error('Error loading gallery:', err);
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load gallery stats
  const loadStats = useCallback(async () => {
    // Remove stats loading since we're simplifying the UI
  }, []);

  // Initial load
  useEffect(() => {
    loadGalleryData();
    loadStats();
  }, [loadGalleryData, loadStats]);

  // Retry mechanism
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    loadGalleryData();
  }, [loadGalleryData]);

  // Get filtered items based on active tab
  const filteredItems = useMemo(() => {
    switch (activeTab) {
      case 'photos':
        return galleryItems;
      case 'videos':
        return videoItems;
      case 'all':
      default:
        return [...galleryItems, ...videoItems];
    }
  }, [galleryItems, videoItems, activeTab]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  // Handle item download
  const handleDownload = async (item: GalleryItem | VideoItem) => {
    try {
      if ('image_url' in item) {
        // Handle photo download
        const response = await fetch(item.image_url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.image_name || `${item.title}.jpg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Error downloading item:', err);
    }
  };

  // Handle share
  const handleShare = async (item: GalleryItem | VideoItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description || item.title,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Check if item is a video
  const isVideo = (item: GalleryItem | VideoItem): item is VideoItem => {
    return 'video_url' in item;
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-64 w-full" />
          <div className="p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </Card>
      ))}
    </div>
  );

  // Error state
  if (error && retryCount < 3) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              className="ml-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Animated Header */}
        <div className={`text-center mb-8 ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore memories and moments from our shrine through photos and videos
          </p>
        </div>

        {/* Animated Filter Tabs */}
        <div className={`flex justify-center mb-8 ${isVisible ? 'animate-scaleIn stagger-2' : 'opacity-0'}`}>
          <div className="flex bg-gray-100 rounded-lg p-1 gap-1 shadow-sm hover-glow">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                activeTab === 'all'
                  ? 'bg-green-600 text-white shadow-md scale-105 tab-shimmer'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 transform hover:scale-105 ${
                activeTab === 'photos'
                  ? 'bg-green-600 text-white shadow-md scale-105 tab-shimmer'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
            >
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeTab === 'photos' ? 'rotate-12' : 'hover:rotate-6'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
              Photos
            </button>
            
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 transform hover:scale-105 ${
                activeTab === 'videos'
                  ? 'bg-green-600 text-white shadow-md scale-105 tab-shimmer'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
            >
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeTab === 'videos' ? 'scale-110 animate-pulse-custom' : 'hover:scale-110'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              Videos
            </button>
          </div>
        </div>

        {/* Animated Gallery Content */}
        {loading ? (
          <div className={`${isVisible ? 'animate-fadeInUp stagger-3' : 'opacity-0'}`}>
            <LoadingSkeleton />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className={`text-center py-12 ${isVisible ? 'animate-bounceIn stagger-3' : 'opacity-0'}`}>
            <div className="text-gray-400 mb-4">
              {activeTab === 'photos' ? (
                <svg className="h-12 w-12 mx-auto animate-pulse-custom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
              ) : activeTab === 'videos' ? (
                <svg className="h-12 w-12 mx-auto animate-pulse-custom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              ) : (
                <svg className="h-12 w-12 mx-auto animate-pulse-custom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {activeTab === 'all' ? 'items' : activeTab} found
            </h3>
            <p className="text-gray-600">
              No {activeTab === 'all' ? 'content' : activeTab} has been uploaded yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <Card 
                key={`${isVideo(item) ? 'video' : 'photo'}-${item.id}`}
                className={`overflow-hidden gallery-card cursor-pointer group bg-white hover:shadow-2xl hover:shadow-green-500/20 border-0 shadow-lg hover:-translate-y-2 ${
                  isVisible ? 'animate-floatIn' : 'opacity-0'
                }`}
                style={{animationDelay: `${0.3 + index * 0.1}s`}}
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative">
                  {isVideo(item) ? (
                    // Premium Video Card
                    <div className="relative group">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <ImageWithFallback
                          src={item.thumbnail_url || getVideoThumbnail(item.video_url)}
                          alt={item.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Premium gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                        
                        {/* Premium play button with glow effect */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-150 group-hover:scale-175 transition-transform duration-300" />
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-full p-4 group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-2xl">
                              <Play className="h-8 w-8 text-gray-800 ml-1" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Premium badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg border-0 font-semibold floating-badge">
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <polygon points="23 7 16 12 23 17 23 7"/>
                              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                            </svg>
                            Video
                          </Badge>
                        </div>
                        
                        {/* Duration and views */}
                        <div className="absolute bottom-4 right-4 flex gap-2">
                          {item.duration && (
                            <Badge className="bg-black/80 text-white border-0 backdrop-blur-sm font-medium">
                              {item.duration}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Views counter */}
                        {item.views && (
                          <div className="absolute bottom-4 left-4">
                            <Badge variant="secondary" className="bg-white/90 text-gray-800 border-0 backdrop-blur-sm font-medium">
                              <Eye className="h-3 w-3 mr-1" />
                              {item.views} views
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      {/* Premium hover effect border */}
                      <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-green-400/50 transition-colors duration-300 pointer-events-none" />
                    </div>
                  ) : (
                    // Premium Photo Card with same animations
                    <div className="relative group">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <ImageWithFallback
                          src={getImageUrl((item as GalleryItem).image_url)}
                          alt={item.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Premium gradient overlay for photos */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Premium view button with glow effect */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="relative">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-150 group-hover:scale-175 transition-transform duration-300" />
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-full p-3 group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-2xl">
                              <Eye className="h-6 w-6 text-gray-800" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Photo badge */}
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg border-0 font-semibold floating-badge">
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                              <circle cx="8.5" cy="8.5" r="1.5"/>
                              <polyline points="21,15 16,10 5,21"/>
                            </svg>
                            Photo
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Premium hover effect border */}
                      <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-green-400/50 transition-colors duration-300 pointer-events-none" />
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h3 className="font-bold text-xl mb-2 line-clamp-2 text-gray-900 group-hover:text-green-700 transition-colors">
                      {item.title}
                    </h3>
                    
                    {item.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center text-xs text-gray-500 space-x-3">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(item.created_at)}
                        </div>
                        {isVideo(item) && item.views && (
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {item.views}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                        className={`${
                          isVideo(item) 
                            ? 'text-green-600 hover:text-white hover:bg-gradient-to-r hover:from-green-600 hover:to-green-700 border border-green-200 hover:border-transparent' 
                            : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                        } transition-all duration-300 font-medium`}
                      >
                        {isVideo(item) ? (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Watch
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Premium Item Modal */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-gray-50 to-white border-0 shadow-2xl">
            {selectedItem && (
              <>
                <DialogHeader className="pb-4">
                  <DialogTitle className="flex items-center justify-between text-2xl font-bold text-gray-900">
                    <div className="flex items-center gap-3">
                      <span>{selectedItem.title}</span>
                      {isVideo(selectedItem) && (
                        <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <polygon points="23 7 16 12 23 17 23 7"/>
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                          </svg>
                          Video
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!isVideo(selectedItem) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(selectedItem)}
                          className="border-green-200 text-green-700 hover:bg-green-50"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(selectedItem)}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="relative">
                    {isVideo(selectedItem) ? (
                      // Premium Video Player
                      <div className="relative">
                        <div className="aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
                          <iframe
                            src={selectedItem.video_url}
                            title={selectedItem.title}
                            className="w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        </div>
                        {/* Premium video stats */}
                        <div className="absolute -bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              {selectedItem.views && (
                                <div className="flex items-center text-gray-600">
                                  <Eye className="h-4 w-4 mr-1" />
                                  <span className="font-medium">{selectedItem.views} views</span>
                                </div>
                              )}
                              {selectedItem.duration && (
                                <div className="flex items-center text-gray-600">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span className="font-medium">{selectedItem.duration}</span>
                                </div>
                              )}
                            </div>
                            <div className="text-gray-500">
                              {formatDate(selectedItem.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Photo
                      <div className="rounded-xl overflow-hidden shadow-xl">
                        <ImageWithFallback
                          src={getImageUrl((selectedItem as GalleryItem).image_url)}
                          alt={selectedItem.title}
                          className="w-full max-h-[70vh] object-contain"
                        />
                      </div>
                    )}
                  </div>
                  
                  {selectedItem.description && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border">
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700 leading-relaxed">{selectedItem.description}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500 bg-white/50 backdrop-blur-sm rounded-lg p-4">
                    <Badge 
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white"
                    >
                      {isVideo(selectedItem) ? 'Premium Video' : 'Photo'}
                    </Badge>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">Published {formatDate(selectedItem.created_at)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

