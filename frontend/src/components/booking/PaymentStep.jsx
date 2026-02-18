import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CreditCard, Smartphone, Wallet, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

function PaymentStep({ bookingData, onUpdate, onComplete }) {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Mock service data for calculation
  const services = {
    'home-cleaning': { name: 'Home Cleaning', basePrice: 499, duration: 120 },
    'appliance-repair': { name: 'Appliance Repair', basePrice: 299, duration: 90 },
    'plumbing': { name: 'Plumbing Services', basePrice: 399, duration: 60 },
  };

  const addons = {
    'oven': { name: 'Inside Oven Cleaning', price: 199 },
    'fridge': { name: 'Refrigerator Cleaning', price: 149 },
    'balcony': { name: 'Balcony Cleaning', price: 99 },
    'warranty': { name: 'Extended Warranty', price: 99 },
    'parts': { name: 'Premium Parts', price: 199 },
    'emergency': { name: '24/7 Emergency Support', price: 299 },
    'inspection': { name: 'Complete Inspection', price: 199 },
  };

  const calculateBreakdown = () => {
    let subtotal = 0;
    const breakdown = [];

    bookingData.services.forEach(service => {
      const serviceDetails = services[service.id];
      if (!serviceDetails) return;

      const serviceTotal = serviceDetails.basePrice * service.quantity;
      subtotal += serviceTotal;

      const serviceItem = {
        type: 'service',
        name: `${serviceDetails.name} × ${service.quantity}`,
        amount: serviceTotal,
      };
      breakdown.push(serviceItem);

      // Add addons
      service.addons.forEach(addonId => {
        const addon = addons[addonId];
        if (addon) {
          const addonTotal = addon.price * service.quantity;
          subtotal += addonTotal;
          breakdown.push({
            type: 'addon',
            name: `  + ${addon.name} × ${service.quantity}`,
            amount: addonTotal,
          });
        }
      });
    });

    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + tax;

    return { subtotal, tax, total, breakdown };
  };

  const { subtotal, tax, total, breakdown } = calculateBreakdown();

  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'Credit/Debit Cards, UPI, Net Banking, Wallets',
      icon: <CreditCard className="w-5 h-5" />,
      popular: true,
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'International Cards, Apple Pay, Google Pay',
      icon: <Smartphone className="w-5 h-5" />,
      popular: false,
    },
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment
      setBookingSuccess(true);
      toast.success('Payment successful! Your booking has been confirmed.');
      
      // Update parent component
      onUpdate({
        method: paymentMethod,
        amount: total,
        status: 'completed',
        transactionId: 'TXN' + Date.now(),
      });
      
      // Complete booking after a short delay
      setTimeout(() => {
        onComplete();
      }, 2000);
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Booking Confirmed!
        </h2>
        <p className="text-gray-600 mb-6">
          Your service has been successfully booked. You'll receive a confirmation email shortly.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
          <div className="text-sm text-gray-600">
            <p><strong>Booking ID:</strong> #BKG{Date.now().toString().slice(-6)}</p>
            <p><strong>Date:</strong> {bookingData.dateTime?.dateLabel}</p>
            <p><strong>Time:</strong> {bookingData.dateTime?.timeLabel}</p>
            <p><strong>Amount Paid:</strong> ₹{total.toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Booking Summary</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Address */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Service Address</h4>
            <div className="text-sm text-gray-600">
              <p>{bookingData.address?.name}</p>
              <p>{bookingData.address?.addressLine}</p>
              <p>{bookingData.address?.city} - {bookingData.address?.pincode}</p>
              <p>{bookingData.address?.phone}</p>
            </div>
          </div>
          
          <Separator />
          
          {/* Date & Time */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Scheduled For</h4>
            <div className="text-sm text-gray-600">
              <p>{bookingData.dateTime?.dateLabel}</p>
              <p>{bookingData.dateTime?.timeLabel}</p>
            </div>
          </div>
          
          <Separator />
          
          {/* Services */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Services</h4>
            <div className="space-y-2">
              {bookingData.services.map(service => {
                const serviceDetails = services[service.id];
                if (!serviceDetails) return null;
                
                return (
                  <div key={service.id} className="text-sm">
                    <div className="flex justify-between">
                      <span>{serviceDetails.name} × {service.quantity}</span>
                      <span>₹{(serviceDetails.basePrice * service.quantity).toLocaleString()}</span>
                    </div>
                    {service.addons.map(addonId => {
                      const addon = addons[addonId];
                      if (!addon) return null;
                      return (
                        <div key={addonId} className="flex justify-between text-gray-500 ml-4">
                          <span>+ {addon.name} × {service.quantity}</span>
                          <span>₹{(addon.price * service.quantity).toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Price Breakdown</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {breakdown.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className={item.type === 'addon' ? 'text-gray-500' : 'text-gray-900'}>
                  {item.name}
                </span>
                <span className={item.type === 'addon' ? 'text-gray-500' : 'text-gray-900'}>
                  ₹{item.amount.toLocaleString()}
                </span>
              </div>
            ))}
            
            <Separator />
            
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Tax & Fees (18% GST)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-emerald-600">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Choose Payment Method</h3>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label 
                    htmlFor={method.id} 
                    className="flex-1 flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-600">{method.icon}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{method.name}</span>
                          {method.popular && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
        <div className="text-sm">
          <p className="text-blue-800 font-medium mb-1">Secure Payment</p>
          <p className="text-blue-700">
            Your payment information is encrypted and secure. We don't store your payment details.
          </p>
        </div>
      </div>

      {/* Terms Notice */}
      <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
        <div className="text-sm">
          <p className="text-amber-800 font-medium mb-1">Cancellation Policy</p>
          <p className="text-amber-700">
            Free cancellation up to 4 hours before service. Cancellation within 4 hours may incur charges.
          </p>
        </div>
      </div>

      {/* Pay Button */}
      <div className="pt-4">
        <Button 
          size="lg" 
          className="w-full" 
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing Payment...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Pay ₹{total.toLocaleString()}</span>
            </div>
          )}
        </Button>
        
        <p className="text-center text-xs text-gray-500 mt-3">
          By proceeding, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default PaymentStep;
