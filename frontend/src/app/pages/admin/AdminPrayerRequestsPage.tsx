import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  Heart, 
  Trash2, 
  Eye, 
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

interface PrayerRequest {
  id: number;
  name: string;
  email?: string;
  prayer_request: string;
  status: 'pending' | 'prayed' | 'archived';
  created_at: string;
  updated_at: string;
}

export const AdminPrayerRequestsPage: React.FC = () => {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for now - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPrayerRequests([
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          prayer_request: 'Please pray for my family\'s health and well-being during these difficult times.',
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Mary Smith',
          prayer_request: 'Seeking prayers for guidance in my career decisions and for peace in my heart.',
          status: 'prayed',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const updateRequestStatus = async (id: number, status: 'pending' | 'prayed' | 'archived') => {
    try {
      // TODO: Replace with actual API call
      setPrayerRequests(prev => 
        prev.map(request => 
          request.id === id 
            ? { ...request, status, updated_at: new Date().toISOString() }
            : request
        )
      );
      toast.success(`Prayer request marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update prayer request status');
    }
  };

  const deleteRequest = async (id: number) => {
    try {
      // TODO: Replace with actual API call
      setPrayerRequests(prev => prev.filter(request => request.id !== id));
      setDeleteConfirm(null);
      toast.success('Prayer request deleted successfully');
    } catch (error) {
      toast.error('Failed to delete prayer request');
    }
  };

  const filteredRequests = prayerRequests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.prayer_request.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'prayed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'prayed': return <CheckCircle className="w-4 h-4" />;
      case 'archived': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-green-800 mb-2">Prayer Requests Management</h1>
          <p className="text-gray-600">Manage and respond to prayer requests from visitors</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{prayerRequests.length}</p>
                </div>
                <Heart className="w-8 h-8 text-green-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {prayerRequests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Prayed For</p>
                  <p className="text-2xl font-bold text-green-600">
                    {prayerRequests.filter(r => r.status === 'prayed').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {prayerRequests.filter(r => 
                      new Date(r.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search prayer requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="prayed">Prayed For</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prayer Requests List */}
        <div className="space-y-4">
          {filteredRequests.map(request => (
            <Card key={request.id} className="hover:shadow-md transition-shadow border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{request.name}</span>
                      </div>
                      {request.email && (
                        <span className="text-sm text-gray-500">({request.email})</span>
                      )}
                      <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-gray-700 leading-relaxed">
                        {request.prayer_request.length > 200 
                          ? `${request.prayer_request.substring(0, 200)}...`
                          : request.prayer_request
                        }
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Submitted: {new Date(request.created_at).toLocaleDateString()}</span>
                      <span>Updated: {new Date(request.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-gray-100 hover:bg-gray-200"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {request.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => updateRequestStatus(request.id, 'prayed')}
                        className="bg-green-700 hover:bg-green-800"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark Prayed
                      </Button>
                    )}
                    
                    {request.status === 'prayed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                        onClick={() => updateRequestStatus(request.id, 'archived')}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Archive
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-red-100 text-red-600 hover:bg-red-200"
                      onClick={() => setDeleteConfirm(request.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-600 mb-2">No Prayer Requests Found</h3>
              <p className="text-gray-500">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Prayer requests will appear here when visitors submit them.'
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* View Prayer Request Modal */}
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Prayer Request Details</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{selectedRequest.name}</p>
                  </div>
                  {selectedRequest.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedRequest.email}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <Badge className={`${getStatusColor(selectedRequest.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(selectedRequest.status)}
                      {selectedRequest.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Prayer Request</label>
                  <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg leading-relaxed">
                    {selectedRequest.prayer_request}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <label className="font-medium">Submitted</label>
                    <p>{new Date(selectedRequest.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="font-medium">Last Updated</label>
                    <p>{new Date(selectedRequest.updated_at).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  {selectedRequest.status === 'pending' && (
                    <Button
                      onClick={() => {
                        updateRequestStatus(selectedRequest.id, 'prayed');
                        setSelectedRequest(null);
                      }}
                      className="bg-green-700 hover:bg-green-800"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Prayed For
                    </Button>
                  )}
                  
                  {selectedRequest.status === 'prayed' && (
                    <Button
                      variant="ghost"
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                      onClick={() => {
                        updateRequestStatus(selectedRequest.id, 'archived');
                        setSelectedRequest(null);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Archive Request
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Prayer Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete this prayer request? This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" className="bg-gray-100 hover:bg-gray-200" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => deleteConfirm && deleteRequest(deleteConfirm)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};