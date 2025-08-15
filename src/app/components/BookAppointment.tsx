'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
// import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useAuth } from '../contexts/AuthContext';
import { mockServices, mockUsers, timeSlots } from '../data/mockData';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle } from 'lucide-react';
import { cn } from './ui/utils';

export const BookAppointment: React.FC = () => {
  const { user } = useAuth();
  const [isAnonymous, setIsAnonymous] = useState(!user || user.role !== 'patient');
  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    patientEmail: user?.email || '',
    patientPhone: user?.phone || '',
    service: '',
    dentist: '',
    date: undefined as Date | undefined,
    time: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dentists = mockUsers.filter(u => u.role === 'dentist' || u.role === 'admin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        patientName: user?.name || '',
        patientEmail: user?.email || '',
        patientPhone: user?.phone || '',
        service: '',
        dentist: '',
        date: undefined,
        time: '',
        notes: ''
      });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Appointment Booked!</h3>
            <p className="text-gray-600">
              Your appointment has been successfully scheduled. You will receive a confirmation email shortly.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Book Appointment</h1>
          <p className="text-gray-600">Schedule your dental appointment</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription>
              Fill in your information and preferred appointment time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {(user?.role !== 'patient') && (
                <div className="space-y-4">
                  <h3 className="font-medium">Patient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Full Name</Label>
                      <Input
                        id="patientName"
                        placeholder="Enter patient name"
                        value={formData.patientName}
                        onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientEmail">Email</Label>
                      <Input
                        id="patientEmail"
                        type="email"
                        placeholder="Enter email address"
                        value={formData.patientEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, patientEmail: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientPhone">Phone Number</Label>
                      <Input
                        id="patientPhone"
                        placeholder="Enter phone number"
                        value={formData.patientPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, patientPhone: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific requirements or notes for your appointment"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Booking Appointment...' : 'Book Appointment'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};