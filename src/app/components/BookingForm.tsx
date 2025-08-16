'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';

interface BookingFormProps {
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  onSuccess?: () => void;
}

export function BookingForm({ userEmail, userName, userPhone, onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: userName || '',
    email: userEmail || '',
    phone: userPhone || '',
    reason: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-455ee360/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          patientName: formData.name,
          patientEmail: formData.email,
          patientPhone: formData.phone,
          reason: formData.reason,
          message: formData.message,
          type: 'booking_request', // Initial booking request, not confirmed appointment
          needsStaffConfirmation: true
        })
      });

      if (response.ok) {
        const successMsg = 'Booking request submitted successfully! Our staff will contact you to confirm the date and time.';
        setSubmitMessage(successMsg);
        toast.success('Appointment Request Submitted', {
          description: 'We\'ll contact you within 24 hours to confirm your appointment.'
        });
        setFormData({
          name: userName || '',
          email: userEmail || '',
          phone: userPhone || '',
          reason: '',
          message: ''
        });
        onSuccess?.();
      } else {
        const errorData = await response.json();
        const errorMsg = `Error: ${errorData.error || 'Failed to submit booking request'}`;
        setSubmitMessage(errorMsg);
        toast.error('Booking Failed', {
          description: errorData.error || 'Please try again or call us directly.'
        });
      }
    } catch (error) {
      const errorMsg = 'Network error. Please try again.';
      setSubmitMessage(errorMsg);
      toast.error('Network Error', {
        description: 'Please check your connection and try again.'
      });
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
        <p className="text-sm text-gray-600">
          {userEmail 
            ? "Submit your appointment request. We'll contact you to confirm the date and time."
            : "Submit your request and our staff will contact you to schedule your appointment."
          }
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!userEmail && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">{userEmail ? 'Note (Optional)' : 'Reason for Visit'}</Label>
            <Input
              id="reason"
              name="reason"
              type="text"
              placeholder={userEmail ? "Any specific concerns or requests..." : "e.g., Routine checkup, Tooth pain, Cleaning"}
              value={formData.reason}
              onChange={handleChange}
              required={!userEmail}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Information</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Any additional details about your concern or preferred appointment times..."
              value={formData.message}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
          </Button>

          {submitMessage && (
            <div className={`text-sm p-3 rounded ${
              submitMessage.includes('successfully') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {submitMessage}
            </div>
          )}
        </form>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <p className="font-medium">Next Steps:</p>
          <ul className="mt-1 space-y-1 text-xs">
            <li>• Our staff will review your request</li>
            <li>• We'll contact you to schedule date & time</li>
            <li>• Appointment will be confirmed once scheduled</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}