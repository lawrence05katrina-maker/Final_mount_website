import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { livestreamAdminApi } from '../../../api/livestreamApi';
import { 
  Radio, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Square, 
  Users, 
  Clock, 
  Calendar,
  Eye,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface LivestreamData {
  id: number;
  title: string;
  description?: string;
  stream_url: string;
  thumbnail_url?: string;
  stream_platform: string;
  is_active: boolean;
  is_scheduled: boolean;
  scheduled_at?: string;
  started_at?: string;
  ended_at?: string;
  viewer_count: number;
  max_viewers: number;
  notification_sent: boolean;
  created_at: string;
  updated_at: string;
}

interface LivestreamFormData {
  title: string;
  description: string;
  stream_url: string;
  thumbnail_url: string;
  stream_platform: string;
  is_scheduled: boolean;
  scheduled_at: string;
}

export const AdminLivestreamPage: React.FC = () => {
  const [livestreams, setLivestreams] = useState<LivestreamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStream, setEditingStream] = useState<LivestreamData | null>(null);
  const [formData, setFormData] = useState<LivestreamFormData>({
    title: '',
    description: '',
    stream_url: '',
    thumbnail_url: '',
    stream_platform: 'youtube',
    is_scheduled: false,
    scheduled_at: ''
  });

  useEffect(() => {
    fetchLivestreams();
  }, []);

  const fetchLivestreams = async () => {
    try {
      setLoading(true);
      const response = await livestreamAdminApi.getAll();
      if (response.success) {
        setLivestreams(response.data);
      }
    } catch (error) {
      console.error('Error fetching livestreams:', error);
      toast.error('Failed to load livestreams');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.stream_url) {
      toast.error('Title and stream URL are required');
      return;
    }

    try {
      if (editingStream) {
        const response = await livestreamAdminApi.update(editingStream.id, formData);
        if (response.success) {
          toast.success('Livestream updated successfully');
          fetchLivestreams();
          resetForm();
        }
      } else {
        const response = await livestreamAdminApi.create(formData);
        if (response.success) {
          toast.success('Livestream created successfully');
          fetchLivestreams();
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving livestream:', error);
      toast.error('Failed to save livestream');
    }
  };

  const handleEdit = (stream: LivestreamData) => {
    setEditingStream(stream);
    setFormData({
      title: stream.title,
      description: stream.description || '',
      stream_url: stream.stream_url,
      thumbnail_url: stream.thumbnail_url || '',
      stream_platform: stream.stream_platform,
      is_scheduled: stream.is_scheduled,
      scheduled_at: stream.scheduled_at ? new Date(stream.scheduled_at).toISOString().slice(0, 16) : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this livestream?')) {
      return;
    }

    try {
      const response = await livestreamAdminApi.delete(id);
      if (response.success) {
        toast.success('Livestream deleted successfully');
        fetchLivestreams();
      }
    } catch (error) {
      console.error('Error deleting livestream:', error);
      toast.error('Failed to delete livestream');
    }
  };

  const handleStart = async (id: number) => {
    try {
      const response = await livestreamAdminApi.start(id);
      if (response.success) {
        toast.success('Livestream started successfully');
        fetchLivestreams();
      }
    } catch (error) {
      console.error('Error starting livestream:', error);
      toast.error('Failed to start livestream');
    }
  };

  const handleEnd = async (id: number) => {
    try {
      const response = await livestreamAdminApi.end(id);
      if (response.success) {
        toast.success('Livestream ended successfully');
        fetchLivestreams();
      }
    } catch (error) {
      console.error('Error ending livestream:', error);
      toast.error('Failed to end livestream');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      stream_url: '',
      thumbnail_url: '',
      stream_platform: 'youtube',
      is_scheduled: false,
      scheduled_at: ''
    });
    setEditingStream(null);
    setShowForm(false);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (stream: LivestreamData) => {
    if (stream.is_active) {
      return <Badge className="bg-red-600 text-white">Live</Badge>;
    }
    if (stream.is_scheduled && stream.scheduled_at && new Date(stream.scheduled_at) > new Date()) {
      return <Badge className="bg-blue-600 text-white">Scheduled</Badge>;
    }
    if (stream.ended_at) {
      return <Badge variant="outline" className="border-gray-300 text-gray-600">Ended</Badge>;
    }
    return <Badge variant="outline" className="border-gray-300 text-gray-600">Draft</Badge>;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-green-700">
            <div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading livestreams...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Radio className="w-8 h-8 text-green-600" />
            Livestream Management
          </h1>
          <p className="text-gray-600 mt-2">Manage live streams and scheduled broadcasts</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Livestream
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Streams</p>
                <p className="text-2xl font-bold text-gray-900">{livestreams.length}</p>
              </div>
              <Radio className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Now</p>
                <p className="text-2xl font-bold text-red-600">
                  {livestreams.filter(s => s.is_active).length}
                </p>
              </div>
              <Play className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">
                  {livestreams.filter(s => s.is_scheduled && s.scheduled_at && new Date(s.scheduled_at) > new Date()).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-green-600">
                  {livestreams.reduce((sum, s) => sum + s.max_viewers, 0)}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Livestream Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{editingStream ? 'Edit Livestream' : 'Create New Livestream'}</span>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter livestream title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stream URL *
                  </label>
                  <input
                    type="url"
                    value={formData.stream_url}
                    onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=VIDEO_ID or https://youtube.com/embed/VIDEO_ID"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    For YouTube: Use watch URL (youtube.com/watch?v=ID) or embed URL (youtube.com/embed/ID)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <select
                    value={formData.stream_platform}
                    onChange={(e) => setFormData({ ...formData, stream_platform: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="facebook">Facebook</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_scheduled"
                    checked={formData.is_scheduled}
                    onChange={(e) => setFormData({ ...formData, is_scheduled: e.target.checked })}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="is_scheduled" className="text-sm font-medium text-gray-700">
                    Schedule this livestream
                  </label>
                </div>

                {formData.is_scheduled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduled_at}
                      onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingStream ? 'Update Livestream' : 'Create Livestream'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Livestreams List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">All Livestreams</h2>
        
        {livestreams.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Radio className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No livestreams yet</h3>
              <p className="text-gray-600 mb-4">Create your first livestream to get started</p>
              <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Livestream
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {livestreams.map((stream) => (
              <Card key={stream.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{stream.title}</h3>
                        {getStatusBadge(stream)}
                      </div>
                      
                      {stream.description && (
                        <p className="text-gray-600 mb-3">{stream.description}</p>
                      )}
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="space-y-1">
                          {stream.is_scheduled && stream.scheduled_at && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Scheduled: {formatDateTime(stream.scheduled_at)}</span>
                            </div>
                          )}
                          
                          {stream.started_at && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Started: {formatDateTime(stream.started_at)}</span>
                            </div>
                          )}
                          
                          {stream.ended_at && (
                            <div className="flex items-center gap-1">
                              <Play className="w-4 h-4" />
                              <span>Ended: {formatDateTime(stream.ended_at)}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>Current: {stream.viewer_count} viewers</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>Peak: {stream.max_viewers} viewers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(stream.stream_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(stream)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      {stream.is_active ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-700 hover:bg-red-50"
                          onClick={() => handleEnd(stream.id)}
                        >
                          <Square className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-200 text-green-700 hover:bg-green-50"
                          onClick={() => handleStart(stream.id)}
                          disabled={stream.ended_at !== null}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(stream.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};