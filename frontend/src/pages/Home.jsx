import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowRight, Shield, Clock, Users, Star, CheckCircle, PlayCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { isAuthenticated } = useAuth();

  const services = [
    {
      id: 1,
      name: 'Home Cleaning',
      description: 'Professional deep cleaning for your home',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
      price: 'Starting ₹499',
      rating: 4.9,
      bookings: '12k+',
    },
    {
      id: 2,
      name: 'Appliance Repair',
      description: 'Quick fixes for all your home appliances',
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
      price: 'Starting ₹299',
      rating: 4.8,
      bookings: '8k+',
    },
    {
      id: 3,
      name: 'Plumbing Services',
      description: 'Expert plumbers for all water-related issues',
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop',
      price: 'Starting ₹399',
      rating: 4.7,
      bookings: '15k+',
    },
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
      title: 'Verified Professionals',
      description: 'All service providers are background-checked and verified',
    },
    {
      icon: <Clock className="w-8 h-8 text-emerald-500" />,
      title: 'On-Time Service',
      description: 'Punctual service delivery with real-time tracking',
    },
    {
      icon: <Users className="w-8 h-8 text-emerald-500" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for your peace of mind',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      rating: 5,
      comment: 'Amazing service! The cleaner was professional and thorough. My house has never been this clean.',
      service: 'Home Cleaning',
    },
    {
      name: 'Raj Patel',
      location: 'Pune',
      rating: 5,
      comment: 'Quick response for AC repair. Fixed the issue in no time and at a reasonable price.',
      service: 'Appliance Repair',
    },
    {
      name: 'Anjali Singh',
      location: 'Delhi',
      rating: 5,
      comment: 'The plumber arrived on time and solved our water leakage problem efficiently.',
      service: 'Plumbing',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  India's #1 Home Services Platform
                </Badge>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold font-heading text-gray-900 mb-6 text-shadow">
                Home Services
                <span className="gradient-text block">Made Simple</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
                Book trusted professionals for cleaning, repairs, maintenance and more. 
                Quality service guaranteed, right at your doorstep.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="btn-primary group" asChild>
                  <Link to={isAuthenticated ? "/book" : "/services"}>
                    {isAuthenticated ? 'Book a Service' : 'Explore Services'}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="btn-secondary group" asChild>
                  <Link to="/services">
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>50,000+ Happy Customers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>1000+ Verified Professionals</span>
                </div>
              </div>
            </div>
            
            <div className="relative animate-slideInRight">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=500&fit=crop&q=80" 
                  alt="Professional home service" 
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Service in Progress</span>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-emerald-500 text-white p-3 rounded-xl shadow-lg">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-xs font-bold block mt-1">4.9★</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl transform rotate-3 -z-10 opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading text-gray-900 mb-4">
              Why Choose SUASH?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional home services with unmatched quality and reliability.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card text-center p-6 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="space-y-4">
                  <div className="flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold font-heading text-gray-900 mb-4">
                Popular Services
              </h2>
              <p className="text-lg text-gray-600">
                Book the most requested home services in your area.
              </p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link to="/services">
                View All Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="service-card overflow-hidden">
                <div className="relative">
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white text-gray-800 shadow-sm">
                      {service.bookings} booked
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                      <Star className="w-3 h-3 fill-current text-yellow-400" />
                      <span>{service.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-emerald-600">{service.price}</span>
                    <Button size="sm" asChild>
                      <Link to={`/services/${service.id}`}>
                        Book Now
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" asChild>
              <Link to="/services">
                View All Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Don't just take our word for it. See what our satisfied customers have to say.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card p-6">
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 italic leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {testimonial.service}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold font-heading text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-emerald-100 mb-8">
            Join thousands of happy customers who trust SUASH for their home service needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100" asChild>
              <Link to={isAuthenticated ? "/book" : "/auth/register"}>
                {isAuthenticated ? 'Book a Service' : 'Get Started Today'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600" asChild>
              <Link to="/services">
                Browse Services
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
