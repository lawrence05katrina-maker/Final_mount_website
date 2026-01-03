import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { MessageCircle, Send, CheckCircle, Star } from 'lucide-react';
import { toast } from 'sonner';
import {
  createTestimony,
  getApprovedTestimonies,
  getAllTestimonies
} from '../../api/testimonyApi';

/* ===================== TYPES ===================== */

interface Testimony {
  id: number;
  name: string;
  testimony: string;
  status: 'pending' | 'approved' | 'rejected';
  date?: string;
  created_at?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/* ===================== COMPONENT ===================== */

export const TestimoniesPage: React.FC = () => {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    testimony: '',
  });

  useEffect(() => {
    // Trigger animations on mount
    setIsVisible(true);
  }, []);

  /* ===================== HANDLERS ===================== */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.testimony) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const response = await createTestimony(formData);

      if (response.data.success) {
        toast.success('Testimony submitted for review');
        setSubmitted(true);
      } else {
        toast.error(response.data.message || 'Failed to submit testimony');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Network error');
    }
  };

  /* ===================== FETCH DATA ===================== */

  const fetchApprovedTestimonies = async () => {
    try {
      setLoading(true);

      // Approved testimonies
      const response = await getApprovedTestimonies();
      const approvedData = response.data as ApiResponse<Testimony[]>;

      if (approvedData.success) {
        setTestimonies(approvedData.data);
      }

      // All testimonies (for pending count)
      const allResponse = await getAllTestimonies();
      const allData = allResponse.data as ApiResponse<Testimony[]>;

      if (allData.success) {
        const pending = allData.data.filter(
          (t: Testimony) => t.status === 'pending'
        ).length;

        setPendingCount(pending);

        console.log(
          `Total: ${allData.data.length}, Approved: ${approvedData.data.length}, Pending: ${pending}`
        );
      }
    } catch (error) {
      console.error('Failed to load testimonies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedTestimonies();
  }, []);

  /* ===================== UI STATES ===================== */

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-green-50">

        <Card className="max-w-md w-full border-green-200 card-hover animate-scaleIn">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-float">
              <CheckCircle className="w-10 h-10 text-green-700" />
            </div>
            <h2 className="text-green-800 mb-4">Thank You!</h2>
            <p className="text-gray-700 mb-6">
              Your testimony has been submitted and is awaiting admin approval.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setShowForm(false);
                  setFormData({ name: '', testimony: '' });
                }}
                className="w-full bg-green-700 hover:bg-green-800 animate-pulse-custom"
              >
                View Testimonies
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', testimony: '' });
                }}
                className="w-full border-green-700 text-green-700"
              >
                Submit Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ===================== MAIN UI ===================== */

  return (
    <div className="min-h-screen py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <div className={`flex justify-center items-center gap-2 mb-4 ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
            <MessageCircle className="w-8 h-8 text-green-700 animate-float" />
            <h1 className="text-green-800">Miracles & Testimonies</h1>
          </div>

          <p className={`text-gray-700 mb-6 max-w-2xl mx-auto ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`}>
            Read inspiring stories of faith and answered prayers through
            Saint Devasahayam.
          </p>

          <Button
            onClick={() => setShowForm(true)}
            className={`bg-green-700 hover:bg-green-800 animate-pulse-custom ${isVisible ? 'animate-scaleIn stagger-3' : 'opacity-0'}`}
          >
            <Send className="w-5 h-5 mr-2" />
            Share Your Testimony
          </Button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className={`text-center py-12 ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4" />
            <p className="text-gray-600">Loading testimonies...</p>
          </div>
        ) : testimonies.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonies.map((testimony, index) => (
              <Card key={testimony.id} className={`border-green-200 card-hover ${isVisible ? `animate-scaleIn stagger-${(index % 6) + 1}` : 'opacity-0'}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center animate-float" style={{animationDelay: `${index * 0.2}s`}}>
                      <Star className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-gray-800">{testimony.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(
                          testimony.date || testimony.created_at || ''
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed">
                    "{testimony.testimony}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
            <Card className="max-w-md mx-auto border-green-200 card-hover">
              <CardContent className="pt-6">
                <MessageCircle className="w-12 h-12 text-green-700 mx-auto mb-4 animate-float" />
                <p className="text-gray-600 mb-3">
                  {pendingCount > 0
                    ? `${pendingCount} testimonies awaiting approval.`
                    : 'No testimonies yet. Be the first to share!'}
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-green-700 hover:bg-green-800 animate-pulse-custom"
                >
                  Share Testimony
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
