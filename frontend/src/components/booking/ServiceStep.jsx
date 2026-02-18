import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, Minus, Star, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

function ServiceStep({ data, onUpdate, preSelectedService }) {
  const [selectedServices, setSelectedServices] = useState(data || []);

  // Mock services data
  const services = [
    {
      id: 'home-cleaning',
      name: 'Home Cleaning',
      description: 'Professional deep cleaning for your entire home',
      basePrice: 499,
      duration: 120,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop',
      addons: [
        { id: 'oven', name: 'Inside Oven Cleaning', price: 199 },
        { id: 'fridge', name: 'Refrigerator Cleaning', price: 149 },
        { id: 'balcony', name: 'Balcony Cleaning', price: 99 },
      ],
    },
    {
      id: 'appliance-repair',
      name: 'Appliance Repair',
      description: 'Expert repair services for all home appliances',
      basePrice: 299,
      duration: 90,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&h=200&fit=crop',
      addons: [
        { id: 'warranty', name: 'Extended Warranty', price: 99 },
        { id: 'parts', name: 'Premium Parts', price: 199 },
      ],
    },
    {
      id: 'plumbing',
      name: 'Plumbing Services',
      description: 'Professional plumbing solutions for your home',
      basePrice: 399,
      duration: 60,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&h=200&fit=crop',
      addons: [
        { id: 'emergency', name: '24/7 Emergency Support', price: 299 },
        { id: 'inspection', name: 'Complete Inspection', price: 199 },
      ],
    },
  ];

  // Pre-select service if provided
  useEffect(() => {
    if (preSelectedService && selectedServices.length === 0) {
      const service = services.find(s => s.id === preSelectedService);
      if (service) {
        const newSelection = [{
          id: service.id,
          quantity: 1,
          addons: [],
        }];
        setSelectedServices(newSelection);
        onUpdate(newSelection);
      }
    }
  }, [preSelectedService]);

  const addService = (serviceId) => {
    const existing = selectedServices.find(s => s.id === serviceId);
    if (existing) {
      updateQuantity(serviceId, existing.quantity + 1);
    } else {
      const newServices = [...selectedServices, {
        id: serviceId,
        quantity: 1,
        addons: [],
      }];
      setSelectedServices(newServices);
      onUpdate(newServices);
      toast.success('Service added to your booking');
    }
  };

  const removeService = (serviceId) => {
    const newServices = selectedServices.filter(s => s.id !== serviceId);
    setSelectedServices(newServices);
    onUpdate(newServices);
    toast.success('Service removed from your booking');
  };

  const updateQuantity = (serviceId, quantity) => {
    if (quantity === 0) {
      removeService(serviceId);
      return;
    }
    
    const newServices = selectedServices.map(s => 
      s.id === serviceId ? { ...s, quantity } : s
    );
    setSelectedServices(newServices);
    onUpdate(newServices);
  };

  const toggleAddon = (serviceId, addonId) => {
    const newServices = selectedServices.map(s => {
      if (s.id === serviceId) {
        const hasAddon = s.addons.includes(addonId);
        return {
          ...s,
          addons: hasAddon 
            ? s.addons.filter(a => a !== addonId)
            : [...s.addons, addonId]
        };
      }
      return s;
    });
    setSelectedServices(newServices);
    onUpdate(newServices);
  };

  const getServiceDetails = (serviceId) => {
    return services.find(s => s.id === serviceId);
  };

  const getSelectedService = (serviceId) => {
    return selectedServices.find(s => s.id === serviceId);
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, selected) => {
      const service = getServiceDetails(selected.id);
      if (!service) return total;
      
      let serviceTotal = service.basePrice * selected.quantity;
      
      // Add addon costs
      selected.addons.forEach(addonId => {
        const addon = service.addons.find(a => a.id === addonId);
        if (addon) {
          serviceTotal += addon.price * selected.quantity;
        }
      });
      
      return total + serviceTotal;
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Selected Services Summary */}
      {selectedServices.length > 0 && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">
                Selected Services ({selectedServices.length})
              </h3>
              <div className="text-2xl font-bold text-emerald-600">
                ₹{calculateTotal().toLocaleString()}
              </div>
            </div>
            <div className="space-y-2">
              {selectedServices.map(selected => {
                const service = getServiceDetails(selected.id);
                if (!service) return null;
                
                return (
                  <div key={selected.id} className="flex items-center justify-between text-sm">
                    <span>{service.name} × {selected.quantity}</span>
                    <span className="font-medium">
                      ₹{(service.basePrice * selected.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Services */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Available Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(service => {
            const selected = getSelectedService(service.id);
            const isSelected = Boolean(selected);
            
            return (
              <Card key={service.id} className={`transition-all duration-200 ${
                isSelected ? 'border-emerald-200 bg-emerald-50' : 'hover:shadow-md'
              }`}>
                <div className="relative">
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-emerald-500 text-white">
                        Added
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {service.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span>{service.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration} mins</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-emerald-600">
                      ₹{service.basePrice.toLocaleString()}
                    </span>
                    
                    {!isSelected ? (
                      <Button 
                        size="sm" 
                        onClick={() => addService(service.id)}
                      >
                        Add Service
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateQuantity(service.id, selected.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-medium min-w-[2rem] text-center">
                          {selected.quantity}
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateQuantity(service.id, selected.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Add-ons */}
                  {isSelected && service.addons.length > 0 && (
                    <div className="border-t pt-3">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Add-ons:
                      </p>
                      <div className="space-y-2">
                        {service.addons.map(addon => (
                          <label 
                            key={addon.id} 
                            className="flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={selected.addons.includes(addon.id)}
                                onChange={() => toggleAddon(service.id, addon.id)}
                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">
                                {addon.name}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-emerald-600">
                              +₹{addon.price}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {isSelected && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full mt-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeService(service.id)}
                    >
                      Remove Service
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      {selectedServices.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Select Services
          </h3>
          <p className="text-gray-600">
            Choose the services you need for your home
          </p>
        </div>
      )}
    </div>
  );
}

export default ServiceStep;
