import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

// Step Components
import AddressStep from '../components/booking/AddressStep';
import ServiceStep from '../components/booking/ServiceStep';
import DateTimeStep from '../components/booking/DateTimeStep';
import PaymentStep from '../components/booking/PaymentStep';

function BookingWizard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preSelectedService = searchParams.get('service');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    address: null,
    services: preSelectedService ? [{ id: preSelectedService, quantity: 1, addons: [] }] : [],
    dateTime: null,
    payment: null,
  });

  const steps = [
    { number: 1, title: 'Address', description: 'Where do you need service?' },
    { number: 2, title: 'Services', description: 'What services do you need?' },
    { number: 3, title: 'Date & Time', description: 'When would you like service?' },
    { number: 4, title: 'Payment', description: 'Review and pay for your booking' },
  ];

  const updateBookingData = (stepData) => {
    setBookingData(prev => ({ ...prev, ...stepData }));
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return bookingData.address !== null;
      case 2:
        return bookingData.services.length > 0;
      case 3:
        return bookingData.dateTime !== null;
      case 4:
        return true; // Payment step handles its own validation
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast.error('Please complete the current step before proceeding.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleStepClick = (stepNumber) => {
    // Allow going to previous steps or current step
    if (stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
    } else {
      // Check if we can proceed to the clicked step
      let canProceed = true;
      for (let i = 1; i < stepNumber; i++) {
        if (i === 1 && !bookingData.address) canProceed = false;
        if (i === 2 && bookingData.services.length === 0) canProceed = false;
        if (i === 3 && !bookingData.dateTime) canProceed = false;
      }
      
      if (canProceed) {
        setCurrentStep(stepNumber);
      } else {
        toast.error('Please complete previous steps first.');
      }
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AddressStep 
            data={bookingData.address}
            onUpdate={(address) => updateBookingData({ address })}
          />
        );
      case 2:
        return (
          <ServiceStep 
            data={bookingData.services}
            onUpdate={(services) => updateBookingData({ services })}
            preSelectedService={preSelectedService}
          />
        );
      case 3:
        return (
          <DateTimeStep 
            data={bookingData.dateTime}
            onUpdate={(dateTime) => updateBookingData({ dateTime })}
            services={bookingData.services}
          />
        );
      case 4:
        return (
          <PaymentStep 
            bookingData={bookingData}
            onUpdate={(payment) => updateBookingData({ payment })}
            onComplete={() => navigate('/account/bookings')}
          />
        );
      default:
        return null;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Book Service - SUASH</title>
        <meta name="description" content="Book your home service in just a few simple steps" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="group mb-4">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
          <h1 className="text-3xl font-bold font-heading text-gray-900 mb-2">
            Book Your Service
          </h1>
          <p className="text-gray-600">
            Complete your booking in {steps.length} simple steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Navigation */}
        <div className="flex justify-between items-center mb-8 overflow-x-auto">
          {steps.map((step) => {
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;
            const isClickable = step.number <= currentStep || (
              step.number === 2 && bookingData.address ||
              step.number === 3 && bookingData.address && bookingData.services.length > 0 ||
              step.number === 4 && bookingData.address && bookingData.services.length > 0 && bookingData.dateTime
            );

            return (
              <div key={step.number} className="flex-1 min-w-0">
                <button
                  onClick={() => isClickable && handleStepClick(step.number)}
                  className={`w-full text-left ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  disabled={!isClickable}
                >
                  <div className="flex items-center space-x-3 p-4 rounded-lg transition-all duration-200 hover:bg-gray-50">
                    <div className={`step-indicator ${
                      isCompleted ? 'completed' : isActive ? 'active' : 'pending'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span>{step.number}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${
                        isActive ? 'text-emerald-600' : 
                        isCompleted ? 'text-emerald-700' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-gray-600">
                {steps[currentStep - 1].description}
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Step {currentStep} of {steps.length}</span>
          </div>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!canProceedToNextStep()}
              className="flex items-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <div className="w-24" /> // Spacer for layout
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingWizard;
