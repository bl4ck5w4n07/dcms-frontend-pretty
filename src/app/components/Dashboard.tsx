'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { mockAppointments, mockPatientRecords } from '../data/mockData';
import { Calendar, Users, DollarSign, Clock, AlertCircle, CheckCircle, Star } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Common calculations
  const todayAppointments = mockAppointments.filter(
    app => app.date === new Date().toISOString().split('T')[0] && app.status === 'scheduled'
  );
  
  const totalRevenue = mockPatientRecords.reduce((sum, record) => sum + record.cost, 0);
  const totalPatients = new Set(mockAppointments.map(app => app.patientId)).size;
  const completedAppointments = mockAppointments.filter(app => app.status === 'completed').length;

  // Patient-specific data
  const patientAppointments = user?.role === 'patient' 
    ? mockAppointments.filter(app => app.patientId === user.id)
    : [];
  const patientUpcoming = patientAppointments.filter(app => 
    app.status === 'scheduled' && new Date(app.date) >= new Date()
  );
  const patientRecords = user?.role === 'patient'
    ? mockPatientRecords.filter(record => record.patientId === user.id)
    : [];

  // Render different dashboards based on role
  if (user?.role === 'patient') {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Here's your dental health summary</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patientUpcoming.length}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled appointments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patientAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                All appointments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Treatments</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patientRecords.length}</div>
              <p className="text-xs text-muted-foreground">
                Completed treatments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Visit</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {patientAppointments.length > 0 ? '2 weeks' : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Days ago
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled dental visits</CardDescription>
            </CardHeader>
            <CardContent>
              {patientUpcoming.length > 0 ? (
                <div className="space-y-4">
                  {patientUpcoming.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{appointment.service}</p>
                        <p className="text-sm text-gray-600">with {appointment.dentistName}</p>
                        <p className="text-xs text-gray-500">{appointment.date} at {appointment.time}</p>
                      </div>
                      <Badge variant="secondary">
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming appointments</p>
                  <p className="text-sm text-gray-400 mb-4">Book your next visit</p>
                  <Button size="sm">Book Appointment</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Health Reminders</CardTitle>
              <CardDescription>Important dental health tips</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Regular Cleanings</p>
                    <p className="text-sm text-gray-600">Schedule cleanings every 6 months</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Daily Brushing</p>
                    <p className="text-sm text-gray-600">Brush twice daily with fluoride toothpaste</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Floss Daily</p>
                    <p className="text-sm text-gray-600">Remove plaque between teeth daily</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Emergency Care</p>
                    <p className="text-sm text-gray-600">Contact us immediately for dental emergencies</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Staff/Admin/Dentist Dashboard
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {user?.role === 'admin' ? 'Admin Dashboard' : 'Staff Dashboard'}
        </h1>
        <p className="text-gray-600">Overview of your dental clinic</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              Unique patients
            </p>
          </CardContent>
        </Card>

        {(user?.role === 'admin' || user?.role === 'dentist') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total earnings
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAppointments.filter(app => 
                app.date === new Date().toISOString().split('T')[0] && 
                app.status === 'completed'
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Appointments done
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Appointments scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-gray-600">{appointment.service}</p>
                      <p className="text-xs text-gray-500">{appointment.time} with {appointment.dentistName}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {appointment.status}
                      </Badge>
                      {appointment.isAnonymous && (
                        <Badge variant="outline" className="ml-1 text-xs">
                          Walk-in
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">Pending Confirmations</p>
                    <p className="text-sm text-yellow-700">
                      {mockAppointments.filter(app => app.status === 'scheduled').length} appointments need confirmation
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Walk-in Patients</p>
                    <p className="text-sm text-blue-700">Add patients without appointments</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Add Walk-in
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Completed Today</p>
                    <p className="text-sm text-green-700">
                      {completedAppointments} successful treatments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};