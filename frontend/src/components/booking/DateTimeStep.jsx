import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { format, addDays, isToday, isTomorrow, isAfter, startOfDay } from 'date-fns';
import toast from 'react-hot-toast';

function DateTimeStep({ data, onUpdate, services }) {
  const [selectedDate, setSelectedDate] = useState(data?.date || null);
  const [selectedTime, setSelectedTime] = useState(data?.time || null);

  // Generate available time slots
  const timeSlots = [
    { id: '09:00', label: '9:00 AM', available: true },
    { id: '10:00', label: '10:00 AM', available: true },
    { id: '11:00', label: '11:00 AM', available: false },
    { id: '12:00', label: '12:00 PM', available: true },
    { id: '13:00', label: '1:00 PM', available: true },
    { id: '14:00', label: '2:00 PM', available: true },
    { id: '15:00', label: '3:00 PM', available: false },
    { id: '16:00', label: '4:00 PM', available: true },
    { id: '17:00', label: '5:00 PM', available: true },
    { id: '18:00', label: '6:00 PM', available: true },
  ];

  // Quick date options
  const quickDates = [
    {
      date: new Date(),
      label: 'Today',
      badge: 'Same Day',
      available: true,
    },
    {
      date: addDays(new Date(), 1),
      label: 'Tomorrow',
      badge: 'Popular',
      available: true,
    },
    {
      date: addDays(new Date(), 2),
      label: format(addDays(new Date(), 2), 'EEE, MMM d'),
      available: true,
    },
    {
      date: addDays(new Date(), 3),
      label: format(addDays(new Date(), 3), 'EEE, MMM d'),
      available: true,
    },
  ];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
    updateBookingData(date, null);
  };

  const handleTimeSelect = (timeSlot) => {
    if (!timeSlot.available) {
      toast.error('This time slot is not available');
      return;
    }
    
    setSelectedTime(timeSlot.id);
    updateBookingData(selectedDate, timeSlot.id);
  };

  const updateBookingData = (date, time) => {
    if (date && time) {
      onUpdate({
        date: format(date, 'yyyy-MM-dd'),
        time: time,
        dateLabel: format(date, 'EEE, MMM d, yyyy'),
        timeLabel: timeSlots.find(slot => slot.id === time)?.label || time,
      });
    } else {
      onUpdate(null);
    }
  };

  const getTotalDuration = () => {
    if (!services || services.length === 0) return 0;
    
    // Mock service durations - in real app, fetch from API
    const serviceDurations = {
      'home-cleaning': 120,
      'appliance-repair': 90,
      'plumbing': 60,
    };
    
    return services.reduce((total, service) => {
      const duration = serviceDurations[service.id] || 60;
      return total + (duration * service.quantity);
    }, 0);
  };

  const isDateDisabled = (date) => {
    const today = startOfDay(new Date());
    const selectedDay = startOfDay(date);
    
    // Disable past dates
    return selectedDay < today;
  };

  const formatDateLabel = (date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  };

  return (
    <div className="space-y-6">
      {/* Selected Date & Time Display */}
      {selectedDate && selectedTime && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      Selected
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {timeSlots.find(slot => slot.id === selectedTime)?.label}
                    {getTotalDuration() > 0 && (
                      <span className="ml-2">• Estimated {getTotalDuration()} minutes</span>
                    )}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedDate(null);
                  setSelectedTime(null);
                  onUpdate(null);
                }}
              >
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Date Selection */}
      {!selectedDate && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select Date
          </h3>
          
          {/* Quick Date Options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {quickDates.map((option, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(option.date)}
                disabled={!option.available}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  option.available
                    ? 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    {option.label}
                  </span>
                  {option.badge && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        option.badge === 'Same Day' ? 'bg-orange-100 text-orange-700' :
                        option.badge === 'Popular' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {option.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {format(option.date, 'MMM d, yyyy')}
                </p>
              </button>
            ))}
          </div>
          
          {/* Calendar Picker */}
          <div className="flex justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Choose Different Date
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={isDateDisabled}
                  initialFocus
                  className="rounded-md"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* Time Selection */}
      {selectedDate && !selectedTime && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Select Time for {formatDateLabel(selectedDate)}
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedDate(null)}
            >
              Change Date
            </Button>
          </div>
          
          {isToday(selectedDate) && (
            <div className="flex items-start space-x-2 p-3 bg-orange-50 border border-orange-200 rounded-lg mb-4">
              <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
              <div className="text-sm">
                <p className="text-orange-800 font-medium">Same-day booking</p>
                <p className="text-orange-700">
                  For today's booking, please allow extra time for our team to prepare.
                </p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => handleTimeSelect(slot)}
                disabled={!slot.available}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                  slot.available
                    ? 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed text-gray-400'
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{slot.label}</span>
                </div>
                {!slot.available && (
                  <p className="text-xs text-gray-400 mt-1">Booked</p>
                )}
              </button>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>
                Estimated service duration: {getTotalDuration()} minutes
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* No Date Selected State */}
      {!selectedDate && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Choose Your Preferred Date
          </h3>
          <p className="text-gray-600">
            Select a convenient date for your home service
          </p>
        </div>
      )}
    </div>
  );
}

export default DateTimeStep;
