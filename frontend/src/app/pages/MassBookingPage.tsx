import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useShrineData } from '../context/ShrineDataContext';
import { Calendar, IndianRupee, AlertCircle } from 'lucide-react';
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
    intentionType: 'Thanksgiving',
    intentionDescription: '',
    numberOfDays: 1,
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    intentionDescription: '',
    numberOfDays: '',
  });
  const [totalAmount, setTotalAmount] = useState(150);

  useEffect(() => {
    // Trigger animations on mount
    setIsVisible(true);
  }, []);

  // Calculate total amount when number of days changes
  useEffect(() => {
    const amount = 150 * formData.numberOfDays;
    setTotalAmount(amount);
  }, [formData.numberOfDays]);

  // Get placeholder text based on intention type
  const getPlaceholderText = () => {
    switch (formData.intentionType) {
      case 'Thanksgiving':
        return 'Enter thanksgiving intention details';
      case 'Petition':
        return 'Enter petition request details';
      case 'Memorial':
        return 'Enter memorial details (name of the person, etc.)';
      default:
        return 'Enter mass intention details';
    }
  };

  // Check if selected date/time is Sunday 7:00 AM
  const isSundaySevenAM = () => {
    if (!formData.date || !formData.time) return false;
    const selectedDate = new Date(formData.date);
    return selectedDate.getDay() === 0 && formData.time === '07:00';
  };

  const validate = () => {
    const newErrors: typeof errors = {
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      intentionDescription: '',
      numberOfDays: '',
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

    if (!formData.intentionDescription.trim()) {
      newErrors.intentionDescription = 'Mass intention description is required';
    }

    if (!formData.time) {
      newErrors.time = 'Preferred time is required';
    }

    if (formData.numberOfDays < 1) {
      newErrors.numberOfDays = 'Number of days must be at least 1';
    }

    // Check for Sunday 7:00 AM restriction
    if (isSundaySevenAM()) {
      newErrors.date = 'Mass booking is not allowed for Sunday 7:00 AM. Please select another date or time.';
      newErrors.time = 'Mass booking is not allowed for Sunday 7:00 AM. Please select another date or time.';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    try {
      // Submit booking to backend API
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        startDate: formData.date,
        preferredTime: formData.time,
        intentionType: formData.intentionType,
        intentionDescription: formData.intentionDescription,
        numberOfDays: formData.numberOfDays,
        totalAmount: totalAmount,
      };

      const response = await fetch('/api/mass-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit booking');
      }

      // Also save to local context for immediate UI feedback
      addMassBooking({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        intention: `${formData.intentionType}: ${formData.intentionDescription}`,
        amount: totalAmount,
      });

      toast.success('Mass booking submitted successfully!');

      // Navigate to payment page with enhanced state
      navigate('/payment', {
        state: {
          amount: totalAmount,
          purpose: "Mass Booking",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          massDetails: {
            startDate: formData.date,
            preferredTime: formData.time,
            intentionType: formData.intentionType,
            intentionDescription: formData.intentionDescription,
            numberOfDays: formData.numberOfDays,
            totalAmount: totalAmount,
          }
        }
      });

    } catch (error) {
      console.error('Error submitting mass booking:', error);
      toast.error(error.message || 'Failed to submit booking. Please try again.');
    }
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
                        <option value="07:00">7:00 AM</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="18:00">6:00 PM</option>
                      </select>
                      {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                      </div>
                    </div>

                    {/* Mass Intention Type */}
                    <div className="form-field">
                      <Label htmlFor="intentionType">Mass Intention Type <span className='text-red-500'>*</span></Label>
                      <select
                        id="intentionType"
                        name="intentionType"
                        value={formData.intentionType}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                      >
                        <option value="Thanksgiving">Thanksgiving</option>
                        <option value="Petition">Petition</option>
                        <option value="Memorial">Memorial</option>
                      </select>
                    </div>

                    {/* Mass Intention Description */}
                    <div className="form-field">
                      <Label htmlFor="intentionDescription">Mass Intention Details <span className='text-red-500'>*</span></Label>
                      <Textarea
                        id="intentionDescription"
                        name="intentionDescription"
                        value={formData.intentionDescription}
                        onChange={handleChange}
                        placeholder={getPlaceholderText()}
                        rows={4}
                        className={errors.intentionDescription ? 'border-red-500' : ''}
                        required
                      />
                      {errors.intentionDescription && <p className="text-red-500 text-sm mt-1">{errors.intentionDescription}</p>}
                    </div>

                    {/* Number of Days */}
                    <div className="form-field">
                      <Label htmlFor="numberOfDays">Number of Days <span className='text-red-500'>*</span></Label>
                      <Input
                        id="numberOfDays"
                        name="numberOfDays"
                        type="number"
                        min="1"
                        value={formData.numberOfDays}
                        onChange={handleChange}
                        className={errors.numberOfDays ? 'border-red-500' : ''}
                        required
                      />
                      {errors.numberOfDays && <p className="text-red-500 text-sm mt-1">{errors.numberOfDays}</p>}
                      <p className="text-sm text-gray-600 mt-1">
                        Book the same mass intention for multiple consecutive days starting from your selected date.
                      </p>
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
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Price per mass: ₹150
                    </p>
                    <p className="text-sm text-gray-600">
                      Number of days: {formData.numberOfDays}
                    </p>
                    <div className="border-t pt-2">
                      <p className="text-2xl text-green-700 font-bold">
                        ₹{totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
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

          {/* Mass Timings Section - After the form */}
          <div className={`mt-16 ${isVisible ? 'animate-fadeInUp stagger-6' : 'opacity-0'}`}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 border-l-4 border-green-600 pl-4">Mass Timings</h2>
            
            <div className="mass-timings-grid">
              {/* Daily Mass */}
              <div className="mass-timing-card">
                <h3>Daily Mass</h3>
                <ul>
                  <li>
                    <span>Monday - Thursday</span>
                  </li>
                  <li>
                    <span>Morning: 6:00 AM</span>
                  </li>
                  <li>
                    <span>Evening: 6:30 PM</span>
                  </li>
                </ul>
              </div>

              {/* Friday Mass */}
              <div className="mass-timing-card">
                <h3>Friday Mass</h3>
                <ul>
                  <li>
                    <span>Morning: 6:00 AM Mass</span>
                  </li>
                  <li>
                    <span>Morning: 10:30 AM Novena Mass</span>
                  </li>
                  <li>
                    <span>Morning: 11:00 AM Novena Mass</span>
                  </li>
                  <li>
                    <span>Evening: 6:30 PM Mass</span>
                  </li>
                  <li>
                    <span>Night: 8:00 PM Mass 9:00 PM</span>
                  </li>
                  <li className="novena-section">
                    <span>• Novena Devasahayam Anukunj</span>
                  </li>
                  <li className="novena-section">
                    <span>• Thiruvassal Vanakkam</span>
                  </li>
                  <li className="novena-section">
                    <span>• Thirugnanasambandar Vanakkam</span>
                  </li>
                </ul>
              </div>

              {/* Saturday Mass */}
              <div className="mass-timing-card">
                <h3>Saturday Mass</h3>
                <ul>
                  <li>
                    <span>Morning: 6:00 AM Mass</span>
                  </li>
                  <li>
                    <span>Morning: 11:30 AM Novena Mass</span>
                  </li>
                  <li>
                    <span>Evening: 6:30 PM Mass</span>
                  </li>
                  <li>
                    <span>Night: 8:00 PM Mass 9:00 PM</span>
                  </li>
                  <li className="novena-section">
                    <span>• Novena Devasahayam Anukunj</span>
                  </li>
                  <li className="novena-section">
                    <span>• Thiruvassal Vanakkam</span>
                  </li>
                  <li className="novena-section">
                    <span>• Thirugnanasambandar Vanakkam</span>
                  </li>
                </ul>
              </div>

              {/* Sunday Mass */}
              <div className="mass-timing-card">
                <h3>Sunday Mass</h3>
                <ul>
                  <li>
                    <span>Morning: 7:00 AM Mass</span>
                  </li>
                  <li>
                    <span>Morning: 7:00 AM Mass</span>
                  </li>
                  <li>
                    <span>Afternoon: 12:00 PM (for Sacred Pilgrim)</span>
                  </li>
                  <li>
                    <span>Evening: 6:30 PM Mass</span>
                  </li>
                  <li>
                    <span>Night: 8:00 PM Mass 9:00 PM</span>
                  </li>
                  <li className="novena-section">
                    <span>• Novena Devasahayam Anukunj</span>
                  </li>
                  <li className="novena-section">
                    <span>• Thiruvassal Vanakkam</span>
                  </li>
                  <li className="novena-section">
                    <span>• Thirugnanasambandar Vanakkam</span>
                  </li>
                </ul>
              </div>

              {/* Special Days */}
              <div className="mass-timing-card special-days-card">
                <h3>Special Days</h3>
                <p className="special-days-description">Special Days are held at the Shrine on various dates each month, ensuring all visitors have the opportunity to participate.</p>
                <div className="special-days-grid">
                  <ul>
                    <li>
                      <span>• On the 15th of every month - Patron Mass at 7:00 PM</span>
                    </li>
                    <li>
                      <span>• On the 14th of every month - Matha Mahima - Evening Mass at 6:00</span>
                    </li>
                    <li>
                      <span>• First Tuesday - St Anthony's Service</span>
                    </li>
                    <li>
                      <span>• First Wednesday - Our Church</span>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <span>• First Friday - Jesus Square</span>
                    </li>
                    <li>
                      <span>• First Saturday - Devasahayam Patron</span>
                    </li>
                    <li>
                      <span>• First Saturday - Mass at 7:00pm for Our Lady of Sorrows Blessed by Pope on Procession</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <style>{`
              .mass-timings-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.75rem;
                margin-bottom: 2rem;
              }

              .mass-timing-card {
                background: #ffffff;
                border-radius: 14px;
                padding: 1.5rem;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                border-top: 4px solid #2f6b3f;
              }

              .mass-timing-card h3 {
                margin-bottom: 1rem;
                font-size: 1.15rem;
                color: #2f6b3f;
                font-weight: 600;
              }

              .mass-timing-card ul {
                list-style: none;
                padding: 0;
                margin: 0;
              }

              .mass-timing-card li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.55rem 0;
                border-bottom: 1px dashed #e2e8e2;
                font-size: 0.9rem;
              }

              .mass-timing-card li:last-child {
                border-bottom: none;
              }

              .mass-timing-card li span {
                font-weight: 500;
                color: #1f2937;
              }

              .mass-timing-card li.novena-section span {
                font-size: 0.8rem;
                color: #6b7280;
                font-weight: 400;
              }

              .special-days-card {
                grid-column: span 2;
                min-width: 500px;
              }

              .special-days-description {
                font-size: 0.9rem;
                color: #6b7280;
                margin-bottom: 1rem;
                line-height: 1.5;
              }

              .special-days-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 2rem;
              }

              @media (max-width: 640px) {
                .mass-timing-card li {
                  flex-direction: column;
                  align-items: flex-start;
                  gap: 0.25rem;
                }
                
                .special-days-card {
                  grid-column: span 1;
                  min-width: auto;
                }
                
                .special-days-grid {
                  grid-template-columns: 1fr;
                  gap: 1rem;
                }
              }
            `}</style>
          </div>
        </div>
      </div>
    </>
  );
};