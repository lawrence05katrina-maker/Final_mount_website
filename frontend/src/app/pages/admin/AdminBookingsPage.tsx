import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, Search, Check, X, IndianRupee, Eye, CreditCard, User, Phone, Mail, Clock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface MassBooking {
  id: number;
  name: string;
  email: string;
  phone: string;
  start_date: string;
  preferred_time: string;
  intention_type: string;
  intention_description: string;
  number_of_days: number;
  total_amount: number;
  status: 'unread' | 'read';
  created_at: string;
  updated_at: string;
}

interface Payment {
  id: number;
  name: string;
  email: string;
  phone: string;
  amount: number;
  purpose: string;
  utr_number: string;
  screenshot_path: string;
  screenshot_name: string;
  mass_details: any;
  status: 'unread' | 'read';
  created_at: string;
}

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<MassBooking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedBooking, setSelectedBooking] = useState<MassBooking | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingPayments, setBookingPayments] = useState<Payment[]>([]);

  useEffect(() => {
    fetchBookings();
    fetchPayments();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/mass-bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data.data || []);
      } else {
        toast.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error loading bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/mass-bookings/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data.data || []);
      } else {
        console.error('Failed to fetch payments');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const updateBookingStatus = async (id: number, status: 'read' | 'unread') => {
    try {
      const response = await fetch(`/api/mass-bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === id ? { ...booking, status } : booking
          )
        );
        toast.success(`Booking marked as ${status} successfully!`);
      } else {
        toast.error(`Failed to update booking status`);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Error updating booking status');
    }
  };

  const deleteBooking = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/mass-bookings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookings(prev => prev.filter(booking => booking.id !== id));
        toast.success('Booking deleted successfully!');
      } else {
        toast.error('Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Error deleting booking');
    }
  };

  const getBookingPayments = (booking: MassBooking) => {
    return payments.filter(payment => 
      payment.name === booking.name && 
      payment.email === booking.email &&
      payment.purpose === 'Mass Booking'
    );
  };

  const showBookingPayments = (booking: MassBooking) => {
    const relatedPayments = getBookingPayments(booking);
    setSelectedBooking(booking);
    setBookingPayments(relatedPayments);
    setShowPaymentModal(true);
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const unreadCount = bookings.filter(b => b.status === 'unread').length;
  const readCount = bookings.filter(b => b.status === 'read').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Unread</Badge>;
      case 'read':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Read</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Mass Bookings Management</h1>
          <p className="text-gray-600">Manage mass booking requests and view payment details</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-200">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">Unread</p>
              <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">Read</p>
              <p className="text-2xl font-bold text-green-600">{readCount}</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">Total</p>
              <p className="text-2xl font-bold text-gray-600">{bookings.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Mass Bookings with Payment Details</CardTitle>
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
                  variant={filterStatus === 'unread' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('unread')}
                  className={filterStatus === 'unread' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  Unread
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === 'read' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('read')}
                  className={filterStatus === 'read' ? 'bg-green-700 hover:bg-green-800' : ''}
                >
                  Read
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredBookings.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredBookings.map(booking => {
                  const relatedPayments = getBookingPayments(booking);
                  const hasPayment = relatedPayments.length > 0;
                  const latestPayment = relatedPayments[0];
                  
                  return (
                    <div key={booking.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <p className="font-medium text-gray-800">{booking.name}</p>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{booking.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{booking.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(booking.start_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{booking.preferred_time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {hasPayment && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => showBookingPayments(booking)}
                              className="flex items-center gap-1"
                            >
                              <CreditCard className="w-4 h-4" />
                              View Payment
                            </Button>
                          )}
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => updateBookingStatus(booking.id, booking.status === 'read' ? 'unread' : 'read')}
                              className={booking.status === 'read' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}
                            >
                              {booking.status === 'read' ? 'Mark Unread' : 'Mark Read'}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => deleteBooking(booking.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-gray-600"><strong>Intention Type:</strong> {booking.intention_type}</p>
                          <p className="text-gray-600"><strong>Description:</strong> {booking.intention_description}</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-2">
                          <p className="text-gray-600">
                            <strong>Days:</strong> {booking.number_of_days}
                          </p>
                          <p className="text-gray-600">
                            <strong>Amount:</strong> <span className="text-green-700 font-medium">₹{booking.total_amount}</span>
                          </p>
                          <p className="text-gray-600">
                            <strong>Submitted:</strong> {formatDate(booking.created_at)}
                          </p>
                        </div>
                        
                        {/* Payment Status Indicator */}
                        {hasPayment ? (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-3 h-3 text-blue-600" />
                              <span className="text-blue-800 font-medium">Payment Submitted</span>
                            </div>
                            <p className="text-blue-700 mt-1">
                              UTR: <span className="font-mono">{latestPayment.utr_number}</span> | 
                              Status: <span className="capitalize">{latestPayment.status}</span>
                            </p>
                          </div>
                        ) : (
                          <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                            <div className="flex items-center gap-2">
                              <IndianRupee className="w-3 h-3 text-yellow-600" />
                              <span className="text-yellow-800 font-medium">Payment Pending</span>
                            </div>
                            <p className="text-yellow-700 mt-1">No payment submitted yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No bookings found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Details Modal */}
        {showPaymentModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto transform transition-all duration-200 ease-out animate-slideIn">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Payment Details - {selectedBooking.name}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Booking Details</h4>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <p><strong>Name:</strong> {selectedBooking.name}</p>
                      <p><strong>Email:</strong> {selectedBooking.email}</p>
                      <p><strong>Phone:</strong> {selectedBooking.phone}</p>
                      <p><strong>Amount:</strong> ₹{selectedBooking.total_amount}</p>
                      <p><strong>Date:</strong> {new Date(selectedBooking.start_date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {selectedBooking.preferred_time}</p>
                    </div>
                  </div>
                  
                  {bookingPayments.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="font-medium">Payment Submissions</h4>
                      {bookingPayments.map((payment, index) => (
                        <div key={payment.id} className="border rounded-lg p-4">
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm"><strong>UTR Number:</strong></p>
                              <p className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">{payment.utr_number}</p>
                            </div>
                            <div>
                              <p className="text-sm"><strong>Status:</strong></p>
                              <span className={`px-2 py-1 rounded text-xs ${
                                payment.status === 'verified' ? 'bg-green-100 text-green-800' :
                                payment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                            <div className="mb-4">
                            <p className="text-sm font-medium mb-2">Payment Screenshot:</p>
                            <div className="text-center">
                              <img
                                src={`http://localhost:5000/uploads/payments/${payment.screenshot_name}`}
                                alt="Payment Screenshot"
                                className="max-w-full h-auto border rounded-lg max-h-64"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-image.svg';
                                }}
                              />
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            <p>Submitted: {formatDate(payment.created_at)}</p>
                            <p>Amount: ₹{payment.amount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No payment submissions found for this booking.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};
