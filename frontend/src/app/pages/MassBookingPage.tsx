import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useShrineData } from '../context/ShrineDataContext';
import { Calendar, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

export const MassBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { siteContent, addMassBooking } = useShrineData();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '06:00',
    intention: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    intention: '',
  });

  useEffect(() => {
    // Trigger animations on mount
    setIsVisible(true);
  }, []);

  const validate = () => {
    const newErrors: typeof errors = {
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      intention: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phoneDigits.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.date) {
      newErrors.date = 'Preferred date is required';
    }

    if (!formData.intention.trim()) {
      newErrors.intention = 'Mass intention is required';
    }

    if (!formData.time) {
      newErrors.time = 'Preferred time is required';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    // Save booking 
    addMassBooking({
      ...formData,
      amount: siteContent.massBookingAmount,
    });

    // Navigate to payment page with state
    navigate('/payment', {
      state: {
        amount: siteContent.massBookingAmount,
        purpose: "Mass Booking",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <>
      <div className="min-h-screen py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-12 ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
            <h1 className="text-green-800 mb-4">Book a Holy Mass</h1>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Offer a Holy Mass for your intentions, loved ones, or in memory of departed souls. 
              Please fill out the form below to submit your mass booking request.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Form */}
            <div className={`md:col-span-2 ${isVisible ? 'animate-slideInLeft stagger-2' : 'opacity-0'}`}>
              <Card className="border-green-200 card-hover">
                <CardHeader>
                  <CardTitle className="text-green-800">Booking Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="form-field">
                      <Label htmlFor="name">Full Name <span className='text-red-500'>*</span></Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={errors.name ? 'border-red-500' : ''}
                        required
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="form-field">
                      <Label htmlFor="email">Email Address <span className='text-red-500'>*</span></Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className={errors.email ? 'border-red-500' : ''}
                        required
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div className="form-field">
                      <Label htmlFor="phone">Phone Number <span className='text-red-500'>*</span></Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 12345 67890"
                        className={errors.phone ? 'border-red-500' : ''}
                        required
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    {/* Date and Time */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="form-field">
                        <Label htmlFor="date">Preferred Date <span className='text-red-500'>*</span></Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={formData.date}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className={errors.date ? 'border-red-500' : ''}
                          required
                        />
                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                      </div>
                      <div className="form-field">
                        <Label htmlFor="time">Preferred Time <span className='text-red-500'>*</span></Label>
                        <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.time ? 'border-red-500' : 'border-input'}`}
                        required
                      >
                        <option value="06:00">6:00 AM</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="18:00">6:00 PM</option>
                      </select>
                      {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                      </div>
                    </div>

                    {/* Intention */}
                    <div className="form-field">
                      <Label htmlFor="intention">Mass Intention <span className='text-red-500'>*</span></Label>
                      <Textarea
                        id="intention"
                        name="intention"
                        value={formData.intention}
                        onChange={handleChange}
                        placeholder="Please describe your intention for this mass (e.g., for healing, thanksgiving, in memory of...)"
                        rows={4}
                        className={errors.intention ? 'border-red-500' : ''}
                        required
                      />
                      {errors.intention && <p className="text-red-500 text-sm mt-1">{errors.intention}</p>}
                    </div>

                    <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                      Submit Booking Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Info Sidebar */}
            <div className={`space-y-6 ${isVisible ? 'animate-slideInRight stagger-3' : 'opacity-0'}`}>
              {/* Amount Card */}
              <Card className={`border-green-200 bg-green-50 card-hover ${isVisible ? 'animate-bounceIn stagger-4' : 'opacity-0'}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <IndianRupee className="w-5 h-5 text-green-700" />
                    <h4 className="text-green-800">Mass Booking Amount</h4>
                  </div>
                  <p className="text-3xl text-green-700 mb-2">
                    ₹{siteContent.massBookingAmount}
                  </p>
                  <p className="text-sm text-gray-600">
                    Payment instructions will be sent after approval
                  </p>
                </CardContent>
              </Card>

              {/* Important Note */}
              <Card className={`border-green-200 card-hover ${isVisible ? 'animate-scaleIn stagger-5' : 'opacity-0'}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-green-700" />
                    <h4 className="text-green-800">Important Notes</h4>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Bookings are subject to availability</li>
                    <li>• You will receive confirmation via email</li>
                    <li>• Please arrive 15 minutes before mass time</li>
                    <li>• Contact us for special arrangements</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};