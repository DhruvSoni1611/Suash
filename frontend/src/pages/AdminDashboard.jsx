import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Settings,
  BarChart3,
  ClipboardList,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';

function AdminDashboard() {
  const { user } = useAuth();

  // Mock data - in real app, fetch from API
  const stats = {
    totalBookings: 1247,
    totalRevenue: 156789,
    activeUsers: 843,
    averageRating: 4.8,
    todayBookings: 23,
    monthlyGrowth: 12.5,
  };

  const recentBookings = [
    {
      id: 'BKG001',
      customerName: 'Priya Sharma',
      service: 'Home Cleaning',
      date: '2024-01-15',
      time: '10:00 AM',
      amount: 699,
      status: 'confirmed',
    },
    {
      id: 'BKG002',
      customerName: 'Raj Patel',
      service: 'Plumbing Service',
      date: '2024-01-15',
      time: '2:00 PM',
      amount: 499,
      status: 'in-progress',
    },
    {
      id: 'BKG003',
      customerName: 'Anjali Singh',
      service: 'Appliance Repair',
      date: '2024-01-14',
      time: '11:00 AM',
      amount: 299,
      status: 'completed',
    },
  ];

  const services = [
    {
      id: '1',
      name: 'Home Cleaning',
      category: 'Cleaning',
      basePrice: 499,
      bookings: 342,
      rating: 4.9,
      status: 'active',
    },
    {
      id: '2',
      name: 'Plumbing Services',
      category: 'Repair',
      basePrice: 399,
      bookings: 287,
      rating: 4.7,
      status: 'active',
    },
    {
      id: '3',
      name: 'Appliance Repair',
      category: 'Repair',
      basePrice: 299,
      bookings: 156,
      rating: 4.8,
      status: 'active',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Admin Dashboard - SUASH</title>
        <meta name="description" content="Admin dashboard for managing SUASH platform" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-heading text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.name}. Here's what's happening today.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Reports
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalBookings.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    +{stats.monthlyGrowth}% this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    +{stats.monthlyGrowth}% this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeUsers.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    +{Math.round(stats.monthlyGrowth * 0.8)}% this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageRating}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {stats.todayBookings} bookings today
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="services">Manage Services</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recent Bookings</h2>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {booking.service}
                          </h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Customer: {booking.customerName}</span>
                          <span>{booking.date} at {booking.time}</span>
                          <span>₹{booking.amount}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {booking.status === 'confirmed' && (
                          <Button size="sm">
                            Assign Staff
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Manage Services</h2>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {service.name}
                          </h3>
                          <Badge variant="secondary">
                            {service.category}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800">
                            {service.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>₹{service.basePrice} base price</span>
                          <span>{service.bookings} bookings</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-current text-yellow-400" />
                            <span>{service.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Settings className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Analytics
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">User Management</h2>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    User Management
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Manage customers, staff, and admin users.
                  </p>
                  <Button variant="outline">
                    View All Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Analytics & Reports</h2>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Analytics Dashboard
                  </h3>
                  <p className="text-gray-600 mb-6">
                    View detailed analytics, reports, and insights.
                  </p>
                  <Button variant="outline">
                    Generate Report
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

export default AdminDashboard;
