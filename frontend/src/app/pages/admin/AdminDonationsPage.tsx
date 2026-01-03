import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { useShrineData } from '../../context/ShrineDataContext';
import { IndianRupee, Search, TrendingUp, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const AdminDonationsPage: React.FC = () => {
  const { donations, donationPurposes, addDonationPurpose, deleteDonationPurpose } = useShrineData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPurpose, setShowAddPurpose] = useState(false);
  const [newPurpose, setNewPurpose] = useState({ name: '', description: '' });

  // Filter donations
  const filteredDonations = donations.filter(d =>
    d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const dailyTotal = donations.filter(d => {
    const today = new Date().toDateString();
    const donationDate = new Date(d.date).toDateString();
    return today === donationDate;
  }).reduce((sum, d) => sum + d.amount, 0);

  const monthlyTotal = donations.filter(d => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const donationDate = new Date(d.date);
    return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
  }).reduce((sum, d) => sum + d.amount, 0);

  const handleAddPurpose = () => {
    if (!newPurpose.name || !newPurpose.description) {
      toast.error('Please fill in all fields');
      return;
    }
    addDonationPurpose(newPurpose);
    setNewPurpose({ name: '', description: '' });
    setShowAddPurpose(false);
    toast.success('Donation purpose added successfully!');
  };

  const handleDeletePurpose = (id: string) => {
    if (confirm('Are you sure you want to delete this donation purpose?')) {
      deleteDonationPurpose(id);
      toast.success('Donation purpose deleted successfully!');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-green-800 mb-2">Donation Management</h1>
          <p className="text-gray-600">View and manage all donations</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Donations</p>
                <IndianRupee className="w-5 h-5 text-green-700" />
              </div>
              <p className="text-2xl text-gray-800">₹{totalDonations.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{donations.length} donations</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Today's Donations</p>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl text-gray-800">₹{dailyTotal.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">This Month</p>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl text-gray-800">₹{monthlyTotal.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Donations List */}
          <div className="lg:col-span-2">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">All Donations</CardTitle>
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by donor name or purpose..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredDonations.length > 0 ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {filteredDonations.map(donation => (
                      <div key={donation.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-gray-800">{donation.donorName}</p>
                            <p className="text-sm text-gray-600">{donation.purpose}</p>
                          </div>
                          <p className="text-lg text-green-700">₹{donation.amount}</p>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{new Date(donation.date).toLocaleString()}</span>
                          {donation.email && <span>{donation.email}</span>}
                        </div>
                        {donation.phone && (
                          <p className="text-xs text-gray-500 mt-1">{donation.phone}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No donations found</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Donation Purposes */}
          <div>
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center justify-between">
                  <span>Donation Purposes</span>
                  <Button
                    size="sm"
                    onClick={() => setShowAddPurpose(!showAddPurpose)}
                    className="bg-green-700 hover:bg-green-800"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showAddPurpose && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="purposeName" className="text-xs">Purpose Name</Label>
                        <Input
                          id="purposeName"
                          value={newPurpose.name}
                          onChange={(e) => setNewPurpose(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Charity Works"
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label htmlFor="purposeDesc" className="text-xs">Description</Label>
                        <Input
                          id="purposeDesc"
                          value={newPurpose.description}
                          onChange={(e) => setNewPurpose(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Purpose description"
                          className="h-8"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleAddPurpose} className="flex-1 bg-green-700 hover:bg-green-800 h-8 text-xs">
                          Add
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowAddPurpose(false)} className="flex-1 h-8 text-xs">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {donationPurposes.map(purpose => (
                    <div key={purpose.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm text-gray-800">{purpose.name}</p>
                        <button
                          onClick={() => handleDeletePurpose(purpose.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600">{purpose.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
