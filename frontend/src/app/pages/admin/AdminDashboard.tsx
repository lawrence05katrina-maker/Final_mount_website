import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useShrineData } from '../../context/ShrineDataContext';
import { IndianRupee, Calendar, MessageCircle, Star, TrendingUp, Users } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { donations, massBookings, prayerRequests, testimonies } = useShrineData();

  // Calculate statistics
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const pendingBookings = massBookings.filter(b => b.status === 'pending').length;
  const pendingTestimonies = testimonies.filter(t => t.status === 'pending').length;
  
  // Recent activity
  const recentDonations = donations.slice(0, 5);
  const recentBookings = massBookings.slice(0, 5);

  // Monthly donations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyDonations = donations.filter(d => {
    const date = new Date(d.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-green-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to the Devasahayam Mount Shrine Admin Panel</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Donations</p>
                <IndianRupee className="w-5 h-5 text-green-700" />
              </div>
              <p className="text-2xl text-gray-800">₹{totalDonations.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{donations.length} total</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Pending Bookings</p>
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl text-gray-800">{pendingBookings}</p>
              <p className="text-xs text-gray-500 mt-1">{massBookings.length} total bookings</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Prayer Requests</p>
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl text-gray-800">{prayerRequests.length}</p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Pending Testimonies</p>
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-2xl text-gray-800">{pendingTestimonies}</p>
              <p className="text-xs text-gray-500 mt-1">{testimonies.length} total testimonies</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Summary */}
        <Card className="border-green-200 mb-8 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <TrendingUp className="w-5 h-5" />
              This Month's Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Donations</p>
                <p className="text-xl text-gray-800">₹{monthlyDonations.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Mass Bookings</p>
                <p className="text-xl text-gray-800">
                  {massBookings.filter(b => {
                    const date = new Date(b.submittedAt);
                    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                  }).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Prayer Requests</p>
                <p className="text-xl text-gray-800">
                  {prayerRequests.filter(p => {
                    const date = new Date(p.date);
                    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Donations */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <IndianRupee className="w-5 h-5" />
                Recent Donations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentDonations.length > 0 ? (
                <div className="space-y-3">
                  {recentDonations.map(donation => (
                    <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm text-gray-800">{donation.donorName}</p>
                        <p className="text-xs text-gray-600">{donation.purpose}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-700">₹{donation.amount}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(donation.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No donations yet</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Mass Bookings */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Calendar className="w-5 h-5" />
                Recent Mass Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentBookings.length > 0 ? (
                <div className="space-y-3">
                  {recentBookings.map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm text-gray-800">{booking.name}</p>
                        <p className="text-xs text-gray-600">{booking.date} at {booking.time}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded ${
                          booking.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                          booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No bookings yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
