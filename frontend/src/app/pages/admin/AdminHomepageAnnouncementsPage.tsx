import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Info,
  Home,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import { useShrineData } from '../../context/ShrineDataContext';

export const AdminHomepageAnnouncementsPage: React.FC = () => {
  const { 
    announcements, 
    addAnnouncement, 
    deleteAnnouncement, 
    updateAnnouncement 
  } = useShrineData();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  const priorities = [
    { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'low', label: 'Low Priority', color: 'bg-green-100 text-green-800' }
  ];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      if (editingAnnouncement) {
        updateAnnouncement(editingAnnouncement.id, formData);
        toast.success('Homepage announcement updated successfully');
      } else {
        addAnnouncement(formData);
        toast.success('Homepage announcement created successfully');
      }
      
      setShowAddDialog(false);
      setEditingAnnouncement(null);
      resetForm();
    } catch (error) {
      toast.error('Failed to save announcement');
    }
  };

  // Handle edit
  const handleEdit = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority
    });
    setShowAddDialog(true);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    try {
      deleteAnnouncement(id);
      toast.success('Homepage announcement deleted successfully');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete announcement');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'medium'
    });
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    const priorityConfig = priorities.find(p => p.value === priority);
    return (
      <Badge className={priorityConfig?.color || 'bg-gray-100 text-gray-800'}>
        {priorityConfig?.label || priority}
      </Badge>
    );
  };

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-600" />;
      case 'low':
        return <Info className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-green-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-green-800 mb-1">Homepage Important Announcements</h1>
                <p className="text-gray-600">Manage announcements that appear on the homepage</p>
              </div>
            </div>
            <Button
              onClick={() => {
                setEditingAnnouncement(null);
                resetForm();
                setShowAddDialog(true);
              }}
              className="bg-green-700 hover:bg-green-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Announcement
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
                </div>
                <Bell className="w-8 h-8 text-green-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold text-red-600">
                    {announcements.filter(a => a.priority === 'high').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Medium Priority</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {announcements.filter(a => a.priority === 'medium').length}
                  </p>
                </div>
                <Info className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Low Priority</p>
                  <p className="text-2xl font-bold text-green-600">
                    {announcements.filter(a => a.priority === 'low').length}
                  </p>
                </div>
                <Info className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-700 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-blue-800 font-semibold mb-2">About Homepage Announcements</h4>
                <p className="text-blue-700 text-sm mb-2">
                  These announcements appear in the "Important Announcements" section on the homepage. 
                  Only the first 4 announcements are displayed to visitors.
                </p>
                <ul className="text-blue-700 text-sm space-y-1 ml-4">
                  <li>• High priority announcements show an "Important" badge</li>
                  <li>• Announcements are displayed in the order they were created</li>
                  <li>• Consider the priority level when creating announcements</li>
                  <li>• Keep content concise for better homepage display</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Announcements List */}
        {announcements.length > 0 ? (
          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <Card 
                key={announcement.id} 
                className={`border-l-4 hover:shadow-lg transition-shadow ${
                  announcement.priority === 'high' 
                    ? 'border-l-red-500 border-red-200' 
                    : announcement.priority === 'medium'
                    ? 'border-l-yellow-500 border-yellow-200'
                    : 'border-l-green-500 border-green-200'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      {getPriorityIcon(announcement.priority)}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {announcement.title}
                          </h3>
                          {getPriorityBadge(announcement.priority)}
                          {index < 4 ? (
                            <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              Visible on Homepage
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600 flex items-center gap-1">
                              <EyeOff className="w-3 h-3" />
                              Not Visible (Position {index + 1})
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mb-3">
                          Created on {new Date(announcement.date).toLocaleDateString()} at {new Date(announcement.date).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(announcement)}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirm(announcement.id)}
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {announcement.content}
                    </p>
                  </div>

                  {announcement.priority === 'high' && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium text-sm">
                          This high priority announcement will show an "Important" badge on the homepage.
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-green-200">
            <CardContent className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Homepage Announcements</h3>
              <p className="text-gray-600 mb-6">
                Create your first announcement to display important information on the homepage.
              </p>
              <Button
                onClick={() => {
                  setEditingAnnouncement(null);
                  resetForm();
                  setShowAddDialog(true);
                }}
                className="bg-green-700 hover:bg-green-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Announcement
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-green-800">
                {editingAnnouncement ? 'Edit Homepage Announcement' : 'Add Homepage Announcement'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Announcement Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter announcement title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Announcement Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter announcement content"
                  rows={4}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Keep content concise for better homepage display
                </p>
              </div>

              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value: 'high' | 'medium' | 'low') => 
                    setFormData(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center gap-2">
                          {priority.value === 'high' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                          {priority.value === 'medium' && <Info className="w-4 h-4 text-yellow-600" />}
                          {priority.value === 'low' && <Info className="w-4 h-4 text-green-600" />}
                          {priority.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  High priority announcements show an "Important" badge on the homepage
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-green-700 hover:bg-green-800">
                  {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddDialog(false);
                    setEditingAnnouncement(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
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
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">This action cannot be undone</p>
                  <p className="text-sm text-red-600">The announcement will be permanently removed from the homepage.</p>
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