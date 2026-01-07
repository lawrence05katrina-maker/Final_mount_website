import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { IndianRupee, Search, TrendingUp, CreditCard, User, Phone, Mail, Eye, X } from 'lucide-react';
import { toast } from 'sonner';

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
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export const AdminDonationsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments');
      if (response.ok) {
        const data = await response.json();
        // Filter only donation payments
        const donationPayments = data.data.filter((payment: Payment) => 
          payment.purpose !== 'Mass Booking'
        );
        setPayments(donationPayments || []);
      } else {
        toast.error('Failed to fetch donation payments');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Error loading donation payments');
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (id: number, status: 'verified' | 'rejected') => {
    try {
      const response = await fetch(`/api/payments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setPayments(prev => 
          prev.map(payment => 
            payment.id === id ? { ...payment, status } : payment
          )
        );
        toast.success(`Payment ${status} successfully!`);
      } else {
        toast.error(`Failed to ${status} payment`);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Error updating payment status');
    }
  };

  const showPaymentDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.utr_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const verifiedAmount = payments.filter(p => p.status === 'verified').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const verifiedCount = payments.filter(p => p.status === 'verified').length;
  const rejectedCount = payments.filter(p => p.status === 'rejected').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Pending</Badge>;
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
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
          <div className="text-center">Loading donation payments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Donation Payments Management</h1>
          <p className="text-gray-600">View and verify donation payment submissions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Donations</p>
                <IndianRupee className="w-5 h-5 text-green-700" />
              </div>
              <p className="text-2xl font-bold text-gray-800">₹{totalAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{payments.length} payments</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
              <p className="text-xs text-gray-500 mt-1">₹{pendingAmount.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">Verified</p>
              <p className="text-2xl font-bold text-green-600">{verifiedCount}</p>
              <p className="text-xs text-gray-500 mt-1">₹{verifiedAmount.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Payments List */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Donation Payment Submissions</CardTitle>
            <div className="mt-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, purpose, or UTR number..."
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
                  variant={filterStatus === 'verified' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('verified')}
                  className={filterStatus === 'verified' ? 'bg-green-700 hover:bg-green-800' : ''}
                >
                  Verified
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
            {filteredPayments.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredPayments.map(payment => (
                  <div key={payment.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <p className="font-medium text-gray-800">{payment.name}</p>
                          {getStatusBadge(payment.status)}
                        </div>
                        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{payment.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{payment.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <IndianRupee className="w-4 h-4" />
                            <span className="font-medium text-green-700">₹{payment.amount}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>{formatDate(payment.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => showPaymentDetails(payment)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        {payment.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => updatePaymentStatus(payment.id, 'verified')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Verify
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updatePaymentStatus(payment.id, 'rejected')}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-600"><strong>Purpose:</strong> {payment.purpose}</p>
                        <p className="text-gray-600">
                          <strong>UTR Number:</strong> 
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded ml-2">{payment.utr_number}</span>
                        </p>
                      </div>
                      
                      {/* Payment Status Indicator */}
                      <div className={`mt-2 p-2 rounded text-xs ${
                        payment.status === 'verified' ? 'bg-green-50 text-green-800' :
                        payment.status === 'rejected' ? 'bg-red-50 text-red-800' :
                        'bg-orange-50 text-orange-800'
                      }`}>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-3 h-3" />
                          <span className="font-medium">
                            Payment {payment.status === 'verified' ? 'Verified' : 
                                   payment.status === 'rejected' ? 'Rejected' : 'Pending Verification'}
                          </span>
                        </div>
                        <p className="mt-1">
                          Submitted: {formatDate(payment.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No donation payments found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Details Modal */}
        {showPaymentModal && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Donation Payment Details</h3>
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
                    <h4 className="font-medium mb-2">Donor Information</h4>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <p><strong>Name:</strong> {selectedPayment.name}</p>
                      <p><strong>Email:</strong> {selectedPayment.email}</p>
                      <p><strong>Phone:</strong> {selectedPayment.phone}</p>
                      <p><strong>Amount:</strong> ₹{selectedPayment.amount}</p>
                      <p><strong>Purpose:</strong> {selectedPayment.purpose}</p>
                      <p><strong>Status:</strong> {selectedPayment.status}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-2">UTR Number:</p>
                        <p className="font-mono bg-gray-100 px-3 py-2 rounded text-sm">{selectedPayment.utr_number}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Submission Date:</p>
                        <p className="text-sm">{formatDate(selectedPayment.created_at)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Payment Screenshot:</p>
                      <div className="text-center">
                        <img
                          src={`/uploads/payments/${selectedPayment.screenshot_name}`}
                          alt="Payment Screenshot"
                          className="max-w-full h-auto border rounded-lg max-h-64"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.svg';
                          }}
                        />
                      </div>
                    </div>
                    
                    {selectedPayment.status === 'pending' && (
                      <div className="flex gap-2 justify-center pt-4">
                        <Button
                          onClick={() => {
                            updatePaymentStatus(selectedPayment.id, 'verified');
                            setShowPaymentModal(false);
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Verify Payment
                        </Button>
                        <Button
                          onClick={() => {
                            updatePaymentStatus(selectedPayment.id, 'rejected');
                            setShowPaymentModal(false);
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Reject Payment
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
