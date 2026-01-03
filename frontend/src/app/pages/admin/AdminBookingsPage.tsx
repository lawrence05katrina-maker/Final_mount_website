import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { useShrineData } from '../../context/ShrineDataContext';
import { Calendar, Search, Check, X, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

export const AdminBookingsPage: React.FC = () => {
  const { massBookings, updateMassBookingStatus, siteContent, updateSiteContent } = useShrineData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [editingAmount, setEditingAmount] = useState(false);
  const [newAmount, setNewAmount] = useState(siteContent.massBookingAmount.toString());

  // Filter bookings
  const filteredBookings = massBookings.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = massBookings.filter(b => b.status === 'pending').length;
  const approvedCount = massBookings.filter(b => b.status === 'approved').length;
  const rejectedCount = massBookings.filter(b => b.status === 'rejected').length;

  const handleApprove = (id: string) => {
    updateMassBookingStatus(id, 'approved');
    toast.success('Mass booking approved!');
  };

  const handleReject = (id: string) => {
    if (confirm('Are you sure you want to reject this mass booking?')) {
      updateMassBookingStatus(id, 'rejected');
      toast.success('Mass booking rejected');
    }
  };

  const handleUpdateAmount = () => {
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    updateSiteContent({ massBookingAmount: amount });
    setEditingAmount(false);
    toast.success('Mass booking amount updated successfully!');
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-green-800 mb-2">Mass Bookings Management</h1>
          <p className="text-gray-600">Approve or reject mass booking requests</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-200">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">Total Bookings</p>
              <p className="text-2xl text-gray-800">{massBookings.length}</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">Pending</p>
              <p className="text-2xl text-orange-600">{pendingCount}</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">Approved</p>
              <p className="text-2xl text-green-600">{approvedCount}</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">Rejected</p>
              <p className="text-2xl text-red-600">{rejectedCount}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Bookings List */}
          <div className="lg:col-span-3">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Mass Bookings</CardTitle>
                <div className="mt-4 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={filterStatus === 'all' ? 'default' : 'outline'}
                      onClick={() => setFilterStatus('all')}
                      className={filterStatus === 'all' ? 'bg-green-700 hover:bg-green-800' : ''}
                    >
                      All
                    </Button>
                    <Button
                      size="sm"
                      variant={filterStatus === 'pending' ? 'default' : 'outline'}
                      onClick={() => setFilterStatus('pending')}
                      className={filterStatus === 'pending' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                    >
                      Pending
                    </Button>
                    <Button
                      size="sm"
                      variant={filterStatus === 'approved' ? 'default' : 'outline'}
                      onClick={() => setFilterStatus('approved')}
                      className={filterStatus === 'approved' ? 'bg-green-700 hover:bg-green-800' : ''}
                    >
                      Approved
                    </Button>
                    <Button
                      size="sm"
                      variant={filterStatus === 'rejected' ? 'default' : 'outline'}
                      onClick={() => setFilterStatus('rejected')}
                      className={filterStatus === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                      Rejected
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredBookings.length > 0 ? (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {filteredBookings.map(booking => (
                      <div key={booking.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-gray-800">{booking.name}</p>
                            <p className="text-sm text-gray-600">{booking.email}</p>
                            <p className="text-sm text-gray-600">{booking.phone}</p>
                          </div>
                          <span className={`px-3 py-1 rounded text-sm ${
                            booking.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                            booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2 mb-3 text-sm">
                          <div>
                            <p className="text-gray-600">Date: <span className="text-gray-800">{booking.date}</span></p>
                          </div>
                          <div>
                            <p className="text-gray-600">Time: <span className="text-gray-800">{booking.time}</span></p>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">Intention:</p>
                          <p className="text-sm text-gray-800 mt-1">{booking.intention}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">
                            Amount: <span className="text-green-700">₹{booking.amount}</span>
                          </p>
                          {booking.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(booking.id)}
                                className="bg-green-700 hover:bg-green-800"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(booking.id)}
                                className="border-red-600 text-red-600 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Submitted: {new Date(booking.submittedAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No bookings found</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div>
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5" />
                  Booking Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editingAmount ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        min="1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleUpdateAmount}
                        className="flex-1 bg-green-700 hover:bg-green-800"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingAmount(false);
                          setNewAmount(siteContent.massBookingAmount.toString());
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-3xl text-gray-800 mb-4">₹{siteContent.massBookingAmount}</p>
                    <Button
                      size="sm"
                      onClick={() => setEditingAmount(true)}
                      className="w-full bg-green-700 hover:bg-green-800"
                    >
                      Update Amount
                    </Button>
                    <p className="text-xs text-gray-500 mt-3">
                      This amount will be displayed to users when booking a mass
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
