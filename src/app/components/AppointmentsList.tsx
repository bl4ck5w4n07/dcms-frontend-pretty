'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { mockAppointments } from '../data/mockData';
import { Appointment } from '../types';
import { Calendar, Clock, User, Phone, Mail, Edit, Trash2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const AppointmentsList: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filter appointments based on user role
  const getFilteredAppointments = () => {
    let filtered = appointments;

    // If patient, only show their appointments
    if (user?.role === 'patient') {
      filtered = appointments.filter(app => app.patientId === user.id);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    return filtered;
  };

  const filteredAppointments = getFilteredAppointments();

  const updateAppointmentStatus = async (appointmentId: string, newStatus: Appointment['status']) => {
    setActionLoading(appointmentId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId ? { ...app, status: newStatus } : app
      )
    );
    setActionLoading(null);

    // Update selected appointment if it's the one being modified
    if (selectedAppointment?.id === appointmentId) {
      setSelectedAppointment(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    setActionLoading(appointmentId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAppointments(prev => prev.filter(app => app.id !== appointmentId));
    setActionLoading(null);
  };

  const getStatusBadgeVariiant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'scheduled': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'no-show': return 'outline';
      default: return 'secondary';
    }
  };

  const canModifyAppointment = (appointment: Appointment) => {
    // Patients can't modify appointments
    if (user?.role === 'patient') return false;
    
    // Staff and admin can modify all appointments
    return user?.role === 'dentist' || user?.role === 'admin' || user?.role === 'staff';
  };

  const getActionButtons = (appointment: Appointment) => {
    if (user?.role === 'patient') {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedAppointment(appointment)}
            >
              View Details
            </Button>
          </DialogTrigger>
        </Dialog>
      );
    }

    // Staff action buttons
    return (
      <div className="flex items-center space-x-2">
        {appointment.status === 'scheduled' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
              disabled={actionLoading === appointment.id}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Complete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
              disabled={actionLoading === appointment.id}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <XCircle className="w-3 h-3 mr-1" />
              Cancel
            </Button>
          </>
        )}
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedAppointment(appointment)}
            >
              <Edit className="w-3 h-3" />
            </Button>
          </DialogTrigger>
        </Dialog>

        {(user?.role === 'admin' || user?.role === 'dentist') && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => deleteAppointment(appointment.id)}
            disabled={actionLoading === appointment.id}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {user?.role === 'patient' ? 'My Appointments' : 'Appointments'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'patient' 
              ? 'View and track your appointments' 
              : 'Manage patient appointments'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no-show">No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {user?.role !== 'patient' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Today's Appointments</p>
                  <p className="text-2xl font-bold">
                    {appointments.filter(app => 
                      app.date === new Date().toISOString().split('T')[0] && 
                      app.status === 'scheduled'
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold">
                    {appointments.filter(app => app.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold">
                    {appointments.filter(app => app.status === 'scheduled').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium">Cancelled</p>
                  <p className="text-2xl font-bold">
                    {appointments.filter(app => app.status === 'cancelled').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {user?.role === 'patient' ? 'My Appointments' : 'Appointment List'}
          </CardTitle>
          <CardDescription>
            {filteredAppointments.length} appointment(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {user?.role === 'patient' ? 'Service' : 'Patient'}
                </TableHead>
                <TableHead>
                  {user?.role === 'patient' ? 'Dentist' : 'Service'}
                </TableHead>
                <TableHead>
                  {user?.role === 'patient' ? 'Date & Time' : 'Dentist'}
                </TableHead>
                {user?.role !== 'patient' && <TableHead>Date & Time</TableHead>}
                <TableHead>Status</TableHead>
                {user?.role !== 'patient' && <TableHead>Type</TableHead>}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {user?.role === 'patient' ? (
                      <div className="font-medium">{appointment.service}</div>
                    ) : (
                      <div>
                        <div className="font-medium">{appointment.patientName}</div>
                        <div className="text-sm text-gray-500">{appointment.patientEmail}</div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {user?.role === 'patient' ? appointment.dentistName : appointment.service}
                  </TableCell>
                  <TableCell>
                    {user?.role === 'patient' ? (
                      <div className="flex items-center space-x-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        <span>{appointment.date}</span>
                        <Clock className="w-3 h-3 ml-2" />
                        <span>{appointment.time}</span>
                      </div>
                    ) : (
                      appointment.dentistName
                    )}
                  </TableCell>
                  {user?.role !== 'patient' && (
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        <span>{appointment.date}</span>
                        <Clock className="w-3 h-3 ml-2" />
                        <span>{appointment.time}</span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge variant={getStatusBadgeVariiant(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  {user?.role !== 'patient' && (
                    <TableCell>
                      <Badge variant={appointment.isAnonymous ? 'outline' : 'secondary'}>
                        {appointment.isAnonymous ? 'Walk-in' : 'Registered'}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell>
                    {getActionButtons(appointment)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Dialog for appointment details */}
          <Dialog>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Appointment Details</DialogTitle>
                <DialogDescription>
                  {selectedAppointment && 
                    `${user?.role === 'patient' ? 'Your appointment' : 'Patient appointment'} information`
                  }
                </DialogDescription>
              </DialogHeader>
              {selectedAppointment && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Patient Name</Label>
                      <p className="text-sm font-medium">{selectedAppointment.patientName}</p>
                    </div>
                    <div>
                      <Label>Service</Label>
                      <p className="text-sm font-medium">{selectedAppointment.service}</p>
                    </div>
                    <div>
                      <Label>Date & Time</Label>
                      <p className="text-sm font-medium">
                        {selectedAppointment.date} at {selectedAppointment.time}
                      </p>
                    </div>
                    <div>
                      <Label>Dentist</Label>
                      <p className="text-sm font-medium">{selectedAppointment.dentistName}</p>
                    </div>
                  </div>
                  
                  {user?.role !== 'patient' && (
                    <div>
                      <Label>Contact Information</Label>
                      <div className="text-sm space-y-1 mt-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3" />
                          <span>{selectedAppointment.patientEmail}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3 h-3" />
                          <span>{selectedAppointment.patientPhone}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedAppointment.notes && (
                    <div>
                      <Label>Notes</Label>
                      <p className="text-sm mt-1">{selectedAppointment.notes}</p>
                    </div>
                  )}
                  
                  {canModifyAppointment(selectedAppointment) && (
                    <div>
                      <Label>Update Status</Label>
                      <Select 
                        value={selectedAppointment.status} 
                        onValueChange={(value: Appointment['status']) => 
                          updateAppointmentStatus(selectedAppointment.id, value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="no-show">No Show</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};