import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, Edit2, Trash2, Home, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

function AddressStep({ data, onUpdate }) {
  const { user, isAuthenticated } = useAuth();
  const [selectedAddress, setSelectedAddress] = useState(data);
  const [showForm, setShowForm] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    addressLine: '',
    city: '',
    pincode: '',
    isDefault: false,
  });

  // Mock saved addresses - in real app, fetch from API
  useEffect(() => {
    if (isAuthenticated) {
      setSavedAddresses([
        {
          id: '1',
          name: 'John Doe',
          phone: '+91 98765 43210',
          addressLine: '123 Green Avenue, Sector 18',
          city: 'Mumbai',
          pincode: '400001',
          isDefault: true,
        },
        {
          id: '2',
          name: 'John Doe',
          phone: '+91 98765 43210',
          addressLine: '456 Blue Street, Andheri West',
          city: 'Mumbai',
          pincode: '400058',
          isDefault: false,
        },
      ]);
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.addressLine || !formData.city || !formData.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newAddress = {
      ...formData,
      id: Date.now().toString(), // In real app, this would come from API
    };

    if (isAuthenticated) {
      setSavedAddresses(prev => [...prev, newAddress]);
      toast.success('Address saved successfully!');
    }
    
    setSelectedAddress(newAddress);
    onUpdate(newAddress);
    setShowForm(false);
    
    // Reset form
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      addressLine: '',
      city: '',
      pincode: '',
      isDefault: false,
    });
  };

  const selectAddress = (address) => {
    setSelectedAddress(address);
    onUpdate(address);
  };

  const deleteAddress = (addressId) => {
    setSavedAddresses(prev => prev.filter(addr => addr.id !== addressId));
    if (selectedAddress?.id === addressId) {
      setSelectedAddress(null);
      onUpdate(null);
    }
    toast.success('Address deleted');
  };

  return (
    <div className="space-y-6">
      {/* Selected Address Display */}
      {selectedAddress && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mt-1">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900">{selectedAddress.name}</h3>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      Selected
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{selectedAddress.phone}</p>
                  <p className="text-sm text-gray-700">
                    {selectedAddress.addressLine}, {selectedAddress.city} - {selectedAddress.pincode}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedAddress(null);
                  onUpdate(null);
                }}
              >
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Addresses */}
      {!selectedAddress && isAuthenticated && savedAddresses.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Addresses</h3>
          <div className="space-y-3">
            {savedAddresses.map((address) => (
              <Card key={address.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => selectAddress(address)}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{address.name}</h4>
                        {address.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                      <p className="text-sm text-gray-700">
                        {address.addressLine}, {address.city} - {address.pincode}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteAddress(address.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add New Address */}
      {!selectedAddress && (
        <div>
          {!showForm ? (
            <div className="text-center py-8">
              {savedAddresses.length === 0 && (
                <div className="mb-6">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Add Service Address
                  </h3>
                  <p className="text-gray-600">
                    Let us know where you need the service
                  </p>
                </div>
              )}
              <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </Button>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Address</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="form-label">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="form-label">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="addressLine" className="form-label">Address Line *</Label>
                    <Input
                      id="addressLine"
                      name="addressLine"
                      value={formData.addressLine}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter complete address"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="form-label">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode" className="form-label">Pincode *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter pincode"
                        pattern="[0-9]{6}"
                        required
                      />
                    </div>
                  </div>
                  
                  {isAuthenticated && (
                    <div className="flex items-center space-x-2">
                      <input
                        id="isDefault"
                        name="isDefault"
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="isDefault" className="text-sm text-gray-700">
                        Save as default address
                      </Label>
                    </div>
                  )}
                  
                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1">
                      {isAuthenticated ? 'Save & Select Address' : 'Use This Address'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default AddressStep;
