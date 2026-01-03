import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { 
  Upload, 
  Image as ImageIcon, 
  Video,
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  StarOff,
  Plus,
  Loader2,
  X,
  Play,
  Filter,
  Search,
  Grid3X3,
  List,
  AlertCircle,
  CheckCircle2,
  FileImage
} from 'lucide-react';
import GalleryApi from '../../../api/galleryApi';
import { toast } from 'sonner';

// Helper function to get full image URL
const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return 'https://images.unsplash.com/photo-1758517936201-cb4b8fd39e71?w=400&h=300&fit=crop';
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/uploads')) {
    return `http://localhost:5000${imageUrl}`;
  }
  return imageUrl;
};

interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  image_name: string;
  category: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  file_type?: 'image' | 'video';
  image_type?: string;
  image_size?: number;
}

export const AdminGalleryPage: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    is_featured: false,
    is_active: true,
    display_order: 0,
    file: null as File | null,
    video_url: '', // Add video URL field
    content_type: 'file' as 'file' | 'video_url' // Add content type selector
  });

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'events', label: 'Events' },
    { value: 'ceremonies', label: 'Ceremonies' },
    { value: 'festivals', label: 'Festivals' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'devotees', label: 'Devotees' },
    { value: 'saints', label: 'Saints' },
    { value: 'historical', label: 'Historical' }
  ];

  // Load data on component mount
  useEffect(() => {
    loadGalleryItems();
    loadStats();
  }, []);

  // Filter items based on category and search
  useEffect(() => {
    let filtered = galleryItems;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredItems(filtered);
  }, [galleryItems, selectedCategory, searchTerm]);

  const loadGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await GalleryApi.getAdminGallery();
      
      if (response.success) {
        setGalleryItems(response.data);
      } else {
        toast.error('Failed to load gallery items');
      }
    } catch (error) {
      console.error('Error loading gallery:', error);
      toast.error('Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await GalleryApi.getGalleryStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (!validImageTypes.includes(file.type) && !validVideoTypes.includes(file.type)) {
      toast.error('Please select a valid image or video file');
      return;
    }
    
    if (file.size > maxSize) {
      toast.error('File size must be less than 50MB');
      return;
    }
    
    setFormData(prev => ({ ...prev, file }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!formData.title.trim()) {
      toast.error('Please provide a title');
      return;
    }

    if (formData.content_type === 'file' && !formData.file) {
      toast.error('Please select a file');
      return;
    }

    if (formData.content_type === 'video_url' && !formData.video_url.trim()) {
      toast.error('Please provide a video URL');
      return;
    }

    try {
      setUploading(true);
      
      if (formData.content_type === 'video_url') {
        // Handle video URL (YouTube, etc.)
        const itemData = {
          title: formData.title,
          description: formData.description,
          image_url: formData.video_url,
          image_name: `${formData.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`,
          image_type: 'video/mp4',
          image_size: 0,
          category: formData.category,
          is_featured: formData.is_featured,
          is_active: formData.is_active,
          display_order: formData.display_order,
          file_type: 'video'
        };

        const createResponse = await GalleryApi.createGalleryItem(itemData);
        
        if (createResponse.success) {
          toast.success('Video added successfully!');
          setShowAddDialog(false);
          resetForm();
          loadGalleryItems();
          loadStats();
        } else {
          throw new Error(createResponse.message || 'Failed to add video');
        }
      } else {
        // Handle file upload
        const isVideo = formData.file.type.startsWith('video/');
        
        if (isVideo) {
          // For video files, create item directly (you might want to implement video upload to a service)
          const itemData = {
            title: formData.title,
            description: formData.description,
            image_url: URL.createObjectURL(formData.file), // Temporary - in production, upload to video service
            image_name: formData.file.name,
            image_type: formData.file.type,
            image_size: formData.file.size,
            category: formData.category,
            is_featured: formData.is_featured,
            is_active: formData.is_active,
            display_order: formData.display_order,
            file_type: 'video'
          };

          const createResponse = await GalleryApi.createGalleryItem(itemData);
          
          if (createResponse.success) {
            toast.success('Video uploaded successfully!');
            setShowAddDialog(false);
            resetForm();
            loadGalleryItems();
            loadStats();
          } else {
            throw new Error(createResponse.message || 'Failed to upload video');
          }
        } else {
          // Handle image upload as before
          const uploadResponse = await GalleryApi.uploadImage(formData.file);
          
          if (!uploadResponse.success) {
            throw new Error(uploadResponse.message || 'Upload failed');
          }

          const itemData = {
            title: formData.title,
            description: formData.description,
            image_url: uploadResponse.data.image_url,
            image_name: uploadResponse.data.image_name,
            image_type: formData.file.type,
            image_size: formData.file.size,
            category: formData.category,
            is_featured: formData.is_featured,
            is_active: formData.is_active,
            display_order: formData.display_order,
            file_type: 'image'
          };

          const createResponse = await GalleryApi.createGalleryItem(itemData);
          
          if (createResponse.success) {
            toast.success('Image uploaded successfully!');
            setShowAddDialog(false);
            resetForm();
            loadGalleryItems();
            loadStats();
          } else {
            throw new Error(createResponse.message || 'Failed to create gallery item');
          }
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.message || error.response?.data?.message || 'Failed to create gallery item';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await GalleryApi.deleteGalleryItem(id);
      
      if (response.success) {
        toast.success('Item deleted successfully');
        setDeleteConfirm(null);
        loadGalleryItems();
        loadStats();
      } else {
        toast.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      const response = await GalleryApi.toggleActive(id);
      if (response.success) {
        toast.success('Status updated successfully');
        loadGalleryItems();
      }
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error('Failed to update status');
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      const response = await GalleryApi.toggleFeatured(id);
      if (response.success) {
        toast.success('Featured status updated');
        loadGalleryItems();
      }
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error('Failed to update featured status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'general',
      is_featured: false,
      is_active: true,
      display_order: 0,
      file: null,
      video_url: '',
      content_type: 'file'
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center gap-3 text-green-700">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-lg font-medium">Loading gallery...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-green-800 mb-2">Gallery Management</h1>
            <p className="text-gray-600">Manage your shrine's photo and video gallery</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </Button>
            
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Media
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Total Items</p>
                  <ImageIcon className="w-5 h-5 text-green-700" />
                </div>
                <p className="text-2xl text-gray-800">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-1">All media files</p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Active</p>
                  <CheckCircle2 className="w-5 h-5 text-green-700" />
                </div>
                <p className="text-2xl text-gray-800">{stats.active}</p>
                <p className="text-xs text-gray-500 mt-1">Visible to public</p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Featured</p>
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-2xl text-gray-800">{stats.featured}</p>
                <p className="text-xs text-gray-500 mt-1">Highlighted items</p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Categories</p>
                  <Filter className="w-5 h-5 text-green-700" />
                </div>
                <p className="text-2xl text-gray-800">{Object.keys(stats.categories || {}).length}</p>
                <p className="text-xs text-gray-500 mt-1">Different types</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6 border-green-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search gallery items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-green-200 focus:border-green-400"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48 border-green-200 focus:border-green-400">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Gallery Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <Card key={item.id} className="group overflow-hidden border-green-200 hover:shadow-lg transition-shadow">
                <div className="relative aspect-square bg-gray-100">
                  {item.file_type === 'video' ? (
                    <div className="relative w-full h-full">
                      <video
                        src={getImageUrl(item.image_url)}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <div className="p-3 bg-white bg-opacity-20 rounded-full">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <Badge className="absolute top-2 left-2 bg-purple-600 text-white">
                        <Video className="w-3 h-3 mr-1" />
                        Video
                      </Badge>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={getImageUrl(item.image_url)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 left-2 bg-blue-600 text-white">
                        <FileImage className="w-3 h-3 mr-1" />
                        Image
                      </Badge>
                    </div>
                  )}
                  
                  {/* Status Badges */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {item.is_featured && (
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="w-3 h-3" />
                      </Badge>
                    )}
                    {!item.is_active && (
                      <Badge variant="secondary" className="bg-gray-500 text-white">
                        <EyeOff className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white text-gray-800 hover:bg-gray-100"
                        onClick={() => handleToggleActive(item.id)}
                      >
                        {item.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white text-gray-800 hover:bg-gray-100"
                        onClick={() => handleToggleFeatured(item.id)}
                      >
                        {item.is_featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteConfirm(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h4>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <Badge variant="outline" className="capitalize">
                      {item.category}
                    </Badge>
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredItems.map(item => (
              <Card key={item.id} className="border-green-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.file_type === 'video' ? (
                        <div className="relative w-full h-full">
                          <video
                            src={getImageUrl(item.image_url)}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      ) : (
                        <img
                          src={getImageUrl(item.image_url)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          {item.description && (
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <Badge variant="outline" className="capitalize">
                              {item.category}
                            </Badge>
                            <span>{formatDate(item.created_at)}</span>
                            {item.image_size && (
                              <span>{formatFileSize(item.image_size)}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {item.is_featured && (
                            <Badge className="bg-yellow-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {!item.is_active && (
                            <Badge variant="secondary" className="bg-gray-500 text-white">
                              <EyeOff className="w-3 h-3 mr-1" />
                              Hidden
                            </Badge>
                          )}
                          
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleActive(item.id)}
                              className="border-green-200 text-green-700 hover:bg-green-50"
                            >
                              {item.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleFeatured(item.id)}
                              className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                            >
                              {item.is_featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirm(item.id)}
                              className="border-red-200 text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && !loading && (
          <Card className="border-green-200">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Upload your first image or video to get started'
                }
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Item
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Add Media Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-green-800">Add New Media</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Content Type Selector */}
              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="content_file"
                    name="content_type"
                    value="file"
                    checked={formData.content_type === 'file'}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_type: e.target.value as 'file' | 'video_url' }))}
                    className="text-green-600"
                  />
                  <Label htmlFor="content_file" className="cursor-pointer">Upload File</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="content_video_url"
                    name="content_type"
                    value="video_url"
                    checked={formData.content_type === 'video_url'}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_type: e.target.value as 'file' | 'video_url' }))}
                    className="text-green-600"
                  />
                  <Label htmlFor="content_video_url" className="cursor-pointer">Video URL (YouTube, etc.)</Label>
                </div>
              </div>

              {formData.content_type === 'video_url' ? (
                /* Video URL Input */
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="video_url">Video URL *</Label>
                    <Input
                      id="video_url"
                      value={formData.video_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                      placeholder="https://youtu.be/YMP5kZmEXLs or https://youtube.com/watch?v=..."
                      className="border-green-200 focus:border-green-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supports YouTube URLs. The video will be embedded in the gallery.
                    </p>
                  </div>
                </div>
              ) : (
                /* File Upload Area */
                <div
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-green-200 hover:border-green-300'
                  }`}
                >
                  {formData.file ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        {formData.file.type.startsWith('video/') ? (
                          <Video className="w-8 h-8 text-green-600" />
                        ) : (
                          <FileImage className="w-8 h-8 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{formData.file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(formData.file.size)}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          Drop files here or click to browse
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Supports images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, OGG)
                        </p>
                        <p className="text-xs text-gray-400">Maximum file size: 50MB</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter media title"
                    className="border-green-200 focus:border-green-400"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter media description"
                    rows={3}
                    className="border-green-200 focus:border-green-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="border-green-200 focus:border-green-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    className="border-green-200 focus:border-green-400"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                  <Label htmlFor="is_featured">Featured Item</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active/Visible</Label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    resetForm();
                  }}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploading || !formData.title.trim() || (formData.content_type === 'file' && !formData.file) || (formData.content_type === 'video_url' && !formData.video_url.trim())}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {formData.content_type === 'video_url' ? 'Adding Video...' : 'Uploading...'}
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      {formData.content_type === 'video_url' ? 'Add Video' : 'Upload Media'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-800">Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">This action cannot be undone</p>
                  <p className="text-sm text-red-600">The media file and all associated data will be permanently deleted.</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Permanently
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};