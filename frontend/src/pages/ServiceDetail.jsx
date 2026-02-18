import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Star, Clock, Shield, Users, CheckCircle, ArrowLeft, Calendar } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

function ServiceDetail() {
  const { slug } = useParams();

  // Mock service data - in real app, this would come from API
  const service = {
    id: 'home-cleaning',
    name: 'Professional Home Cleaning',
    slug: 'home-cleaning',
    description: 'Transform your home with our comprehensive cleaning service. Our trained professionals use eco-friendly products and proven techniques to deep clean every corner of your home.',
    longDescription: 'Our professional home cleaning service is designed to give you more time to focus on what matters most. We provide thorough, reliable cleaning that covers everything from dusting and vacuuming to sanitizing bathrooms and kitchens. Our team uses only eco-friendly, non-toxic cleaning products that are safe for your family and pets.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=500&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=300&fit=crop',
    ],
    category: 'Cleaning',
    basePrice: 499,
    duration: 120,
    rating: 4.9,
    reviewCount: 1248,
    bookings: 12000,
    features: [
      'Deep cleaning of all rooms',
      'Eco-friendly cleaning products',
      'Insurance coverage included',
      'Background-verified cleaners',
      'Same-day booking available',
      'Satisfaction guarantee',
    ],
    included: [
      'Dusting all surfaces and furniture',
      'Vacuuming carpets and rugs',
      'Mopping floors',
      'Cleaning bathrooms (toilet, shower, sink)',
      'Kitchen cleaning (counters, appliances, sink)',
      'Cleaning mirrors and windows',
      'Emptying trash bins',
      'Making beds',
    ],
    addOns: [
      { id: '1', name: 'Inside Oven Cleaning', price: 199, description: 'Deep clean inside oven and remove grease' },
      { id: '2', name: 'Refrigerator Cleaning', price: 149, description: 'Clean inside and outside of refrigerator' },
      { id: '3', name: 'Balcony Cleaning', price: 99, description: 'Clean balcony floor and railings' },
      { id: '4', name: 'Ceiling Fan Cleaning', price: 79, description: 'Clean ceiling fans (up to 3 fans)' },
    ],
    faqs: [
      {
        question: 'What cleaning products do you use?',
        answer: 'We use eco-friendly, non-toxic cleaning products that are safe for your family and pets. All our products are biodegradable and environmentally responsible.',
      },
      {
        question: 'How long does the cleaning take?',
        answer: 'For a standard 2-3 bedroom home, cleaning typically takes 2-3 hours. The exact time depends on the size of your home and the level of cleaning required.',
      },
      {
        question: 'Do I need to be home during the cleaning?',
        answer: 'It\'s not necessary for you to be home, but we recommend being available for the initial walkthrough. Our cleaners are fully insured and background-verified.',
      },
      {
        question: 'What if I\'m not satisfied with the cleaning?',
        answer: 'We offer a 100% satisfaction guarantee. If you\'re not happy with any aspect of our cleaning, we\'ll return within 24 hours to make it right at no extra cost.',
      },
    ],
  };

  const reviews = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      date: '2 days ago',
      comment: 'Excellent service! The team was professional, punctual, and thorough. My house has never been this clean. Will definitely book again.',
    },
    {
      id: 2,
      name: 'Raj Patel',
      rating: 5,
      date: '1 week ago',
      comment: 'Amazing attention to detail. They cleaned areas I didn\'t even think about. Great value for money.',
    },
    {
      id: 3,
      name: 'Anjali Singh',
      rating: 4,
      date: '2 weeks ago',
      comment: 'Very good service overall. The cleaners were friendly and efficient. Minor issue with timing but they made up for it with quality work.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{service.name} - SUASH</title>
        <meta name="description" content={service.description} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="group mb-4">
            <Link to="/services">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Services
            </Link>
          </Button>
          <nav className="text-sm text-gray-500">
            <Link to="/" className="hover:text-emerald-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/services" className="hover:text-emerald-600">Services</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{service.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src={service.image} 
                alt={service.name} 
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-white text-gray-800 shadow-lg">
                  {service.bookings.toLocaleString()}+ bookings
                </Badge>
              </div>
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {service.gallery.map((image, index) => (
                <div key={index} className="rounded-xl overflow-hidden">
                  <img 
                    src={image} 
                    alt={`${service.name} ${index + 1}`} 
                    className="w-full h-24 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Service Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Service</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{service.longDescription}</p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {service.included.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Add-ons */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Add-on Services</h2>
                <div className="space-y-4">
                  {service.addOns.map((addon) => (
                    <div key={addon.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{addon.name}</h4>
                        <p className="text-sm text-gray-600">{addon.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <span className="font-semibold text-emerald-600">+₹{addon.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 fill-current text-yellow-400" />
                      <span className="font-semibold text-lg">{service.rating}</span>
                    </div>
                    <span className="text-gray-500">({service.reviewCount} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="text-emerald-700 font-medium text-sm">
                              {review.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{review.name}</p>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {service.faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <Badge variant="secondary" className="mb-4">{service.category}</Badge>
                  
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} mins</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>2-3 cleaners</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                      ))}
                    </div>
                    <span className="font-semibold">{service.rating}</span>
                    <span className="text-gray-500">({service.reviewCount})</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">
                    ₹{service.basePrice.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">Starting price</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-gray-700">Insured & bonded</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-gray-700">Satisfaction guarantee</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-gray-700">Same-day booking</span>
                  </div>
                </div>
                
                <Button size="lg" className="w-full mb-3" asChild>
                  <Link to={`/book?service=${service.id}`}>
                    Book Now
                  </Link>
                </Button>
                
                <Button size="lg" variant="outline" className="w-full" asChild>
                  <Link to="/services">
                    Compare Services
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Why Choose SUASH?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Verified Professionals</p>
                      <p className="text-xs text-gray-600">Background-checked & insured</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Quality Guarantee</p>
                      <p className="text-xs text-gray-600">100% satisfaction or money back</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">24/7 Support</p>
                      <p className="text-xs text-gray-600">Help when you need it</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;
