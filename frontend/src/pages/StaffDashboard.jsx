import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  Play, 
  Pause,
  Star,
  Phone,
  MessageSquare,
  Camera,
  Upload
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';

function StaffDashboard() {
  const { user } = useAuth();

  // Mock data - in real app, fetch from API
  const todayJobs = [
    {
      id: 'JOB001',
      customerName: 'Priya Sharma',
      service: 'Home Cleaning',
      address: '123 Green Avenue, Sector 18, Mumbai',
      phone: '+91 98765 43210',
      scheduledTime: '10:00 AM',
      duration: 120,
      amount: 699,
      status: 'upcoming',
      notes: 'Customer prefers eco-friendly products',
    },
    {
      id: 'JOB002',
      customerName: 'Raj Patel',
      service: 'Plumbing Service',
      address: '456 Blue Street, Andheri West, Mumbai',
      phone: '+91 87654 32109',
      scheduledTime: '2:00 PM',
      duration: 90,
      amount: 499,
      status: 'in-progress',
      startedAt: '2:15 PM',
    },
    {
      id: 'JOB003',
      customerName: 'Anjali Singh',
      service: 'Appliance Repair',
      address: '789 Red Colony, Bandra East, Mumbai',
      phone: '+91 76543 21098',
      scheduledTime: '4:00 PM',
      duration: 60,
      amount: 299,
      status: 'completed',
      completedAt: '5:30 PM',
      rating: 5,
    },
  ];

  const stats = {
    todayJobs: todayJobs.length,
    completedJobs: todayJobs.filter(job => job.status === 'completed').length,
    totalEarnings: todayJobs.reduce((sum, job) => sum + (job.status === 'completed' ? job.amount : 0), 0),
    averageRating: 4.8,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Staff Dashboard - SUASH</title>
        <meta name="description" content="Staff dashboard for managing daily jobs and tasks" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-heading text-gray-900">
                Good morning, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-gray-600 mt-1">
                You have {stats.todayJobs} jobs scheduled for today
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                View Schedule
              </Button>
              <Button>
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.todayJobs}
              </div>
              <p className="text-sm text-gray-600">Today's Jobs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.completedJobs}
              </div>
              <p className="text-sm text-gray-600">Completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                ₹{stats.totalEarnings}
              </div>
              <p className="text-sm text-gray-600">Today's Earnings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.averageRating}
              </div>
              <p className="text-sm text-gray-600">Average Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today's Jobs</TabsTrigger>
            <TabsTrigger value="availability">My Availability</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Today's Jobs */}
          <TabsContent value="today">
            <div className="space-y-4">
              {todayJobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {job.service}
                          </h3>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1).replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{job.scheduledTime} ({job.duration} mins)</span>
                            {job.startedAt && (
                              <span className="text-blue-600">• Started at {job.startedAt}</span>
                            )}
                            {job.completedAt && (
                              <span className="text-green-600">• Completed at {job.completedAt}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{job.address}</span>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Customer:</span>
                              <span>{job.customerName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4" />
                              <span>{job.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-emerald-600">₹{job.amount}</span>
                            </div>
                          </div>
                          
                          {job.notes && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                              <p className="text-amber-800 text-sm">
                                <strong>Note:</strong> {job.notes}
                              </p>
                            </div>
                          )}
                          
                          {job.rating && (
                            <div className="flex items-center space-x-1 mt-2">
                              <span className="text-sm font-medium">Customer Rating:</span>
                              {[...Array(job.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                              ))}
                              <span className="text-sm text-gray-600 ml-1">{job.rating}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Phone className="w-3 h-3 mr-1" />
                          Call Customer
                        </Button>
                        <Button variant="outline" size="sm">
                          <MapPin className="w-3 h-3 mr-1" />
                          Directions
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {job.status === 'upcoming' && (
                          <Button size="sm">
                            <Play className="w-3 h-3 mr-1" />
                            Start Job
                          </Button>
                        )}
                        
                        {job.status === 'in-progress' && (
                          <>
                            <Button variant="outline" size="sm">
                              <Camera className="w-3 h-3 mr-1" />
                              Add Photos
                            </Button>
                            <Button size="sm">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Complete Job
                            </Button>
                          </>
                        )}
                        
                        {job.status === 'completed' && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Job Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">My Availability</h2>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Availability Settings
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Manage your working hours and availability for different services.
                  </p>
                  <Button variant="outline">
                    Update Availability
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Performance Dashboard</h2>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Performance Metrics
                  </h3>
                  <p className="text-gray-600 mb-6">
                    View your ratings, earnings history, and performance analytics.
                  </p>
                  <Button variant="outline">
                    View Detailed Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default StaffDashboard;
