'use client';

import { useAuth } from '@/contexts/AuthContext';
import { PatientProfile } from '@/components/PatientProfile';
import { Dashboard } from '@/components/Dashboard';

export default function MyProfilePage() {
  const { user } = useAuth();

  // Only for patients
  if (user?.role === 'patient') {
    return <PatientProfile />;
  }

  // Fallback to dashboard for other roles
  return <Dashboard />;
}