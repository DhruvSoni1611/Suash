import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Filter, Star, Clock, MapPin, Zap } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

function Services() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  // Mock services data
  const services = [
    {
      id: 'home-cleaning',
      name: 'Home Cleaning',
      slug: 'home-cleaning',
      description: 'Professional deep cleaning for your entire home',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
      category: 'cleaning',
      price: 499,
      duration: 120,
      rating: 4.9,
      bookings: 12000,
      features: ['Deep cleaning', 'Eco-friendly products', 'Insurance covered'],
    },
    {
      id: 'appliance-repair',
      name: 'Appliance Repair',
      slug: 'appliance-repair',
      description: 'Expert repair services for all home appliances',
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
      category: 'repair',
      price: 299,
      duration: 90,
      rating: 4.8,
      bookings: 8500,
      features: ['Same-day service', '90-day warranty', 'Certified technicians'],
    },
    {
      id: 'plumbing',
      name: 'Plumbing Services',
      slug: 'plumbing',
      description: 'Professional plumbing solutions for your home',
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop',
      category: 'repair',
      price: 399,
      duration: 60,
      rating: 4.7,
      bookings: 15000,
      features: ['24/7 emergency', 'Licensed plumbers', 'Quality guarantee'],
    },
    {
      id: 'electrical-work',
      name: 'Electrical Work',
      slug: 'electrical-work',
      description: 'Safe and reliable electrical services',
      image: 'https://images.unsplash.com/photo-1621905252472-e8be32c2175a?w=400&h=300&fit=crop',
      category: 'repair',
      price: 599,
      duration: 90,
      rating: 4.8,
      bookings: 7200,
      features: ['Safety certified', 'Code compliant', 'Emergency service'],
    },
    {
      id: 'painting',
      name: 'Home Painting',
      slug: 'painting',
      description: 'Professional interior and exterior painting',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
      category: 'maintenance',
      price: 2999,
      duration: 480,
      rating: 4.6,
      bookings: 4500,
      features: ['Premium paints', 'Color consultation', 'Clean-up included'],
    },
    {
      id: 'pest-control',
      name: 'Pest Control',
      slug: 'pest-control',
      description: 'Effective pest control and prevention',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      category: 'maintenance',
      price: 1299,
      duration: 180,
      rating: 4.5,
      bookings: 6800,
      features: ['Safe treatments', '3-month guarantee', 'Follow-up service'],
    },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'repair', label: 'Repair & Maintenance' },
    { value: 'maintenance', label: 'Home Maintenance' },
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  // Filter and sort services
  const filteredServices = services
    .filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
        default:
          return b.bookings - a.bookings;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Home Services - SUASH</title>
        <meta name="description" content="Browse professional home services including cleaning, repairs, maintenance and more. Book trusted experts today." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-heading text-gray-900 mb-4">
            Professional Home Services
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our wide range of home services and book trusted professionals for your needs.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredServices.length}</span> services
            {selectedCategory !== 'all' && (
              <span> in <span className="font-semibold">{categories.find(c => c.value === selectedCategory)?.label}</span></span>
            )}
          </p>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="service-card overflow-hidden group">
                <div className="relative">
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white text-gray-800 shadow-sm">
                      {service.bookings.toLocaleString()}+ booked
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                      <Star className="w-3 h-3 fill-current text-yellow-400" />
                      <span>{service.rating}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <Button 
                      className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300" 
                      asChild
                    >
                      <Link to={`/services/${service.slug}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Service Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} mins</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4" />
                      <span>Same day</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-emerald-600">
                        ₹{service.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">onwards</span>
                    </div>
                    <Button asChild>
                      <Link to={`/book?service=${service.id}`}>
                        Book Now
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any services matching your criteria. Try adjusting your filters.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More Button (if needed) */}
        {filteredServices.length > 0 && filteredServices.length >= 6 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Services
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;
