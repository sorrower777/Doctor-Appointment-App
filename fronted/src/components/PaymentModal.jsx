import React, { useState } from 'react';
import { assets } from '../assets/assets/assets_frontend/assets';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  appointmentData, 
  onPaymentSuccess,
  onPaymentCancel 
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Pay securely with your card'
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      icon: assets.razorpay_logo,
      description: 'UPI, Cards, Wallets & More'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: assets.stripe_logo,
      description: 'Secure payment processing'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🅿️',
      description: 'Pay with PayPal account'
    }
  ];

  // Debug: Log asset values to console (remove in production)
  React.useEffect(() => {
    console.log('Razorpay Logo:', assets.razorpay_logo);
    console.log('Stripe Logo:', assets.stripe_logo);
  }, []);

  const validateCardDetails = () => {
    const newErrors = {};
    
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!cardDetails.expiryDate || !/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }
    
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    
    if (!cardDetails.cardholderName.trim()) {
      newErrors.cardholderName = 'Please enter cardholder name';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    }
    
    setCardDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const renderPaymentIcon = (method) => {
    const iconClass = "w-8 h-8 object-contain transition-all duration-200";
    
    switch (method.id) {
      case 'razorpay':
        return assets.razorpay_logo ? (
          <img 
            src={assets.razorpay_logo} 
            alt={method.name} 
            className={iconClass}
            style={{ filter: 'brightness(1.1)' }}
            onError={(e) => {
              console.error('Failed to load Razorpay logo');
              e.target.outerHTML = `<span class="text-2xl text-blue-600">🏦</span>`;
            }}
            onLoad={() => console.log('Razorpay logo loaded successfully')}
          />
        ) : (
          <span className="text-2xl text-blue-600">🏦</span>
        );
      case 'stripe':
        return assets.stripe_logo ? (
          <img 
            src={assets.stripe_logo} 
            alt={method.name} 
            className={iconClass}
            style={{ filter: 'brightness(1.1)' }}
            onError={(e) => {
              console.error('Failed to load Stripe logo');
              e.target.outerHTML = `<span class="text-2xl text-purple-600">�</span>`;
            }}
            onLoad={() => console.log('Stripe logo loaded successfully')}
          />
        ) : (
          <span className="text-2xl text-purple-600">💎</span>
        );
      default:
        return <span className="text-2xl">{method.icon}</span>;
    }
  };

  const simulatePayment = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 95% success rate
        const success = Math.random() > 0.05;
        resolve(success);
      }, 2000);
    });
  };

  const handlePayment = async () => {
    if (selectedPaymentMethod === 'card' && !validateCardDetails()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      const paymentSuccess = await simulatePayment();
      
      if (paymentSuccess) {
        const paymentData = {
          paymentId: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          method: selectedPaymentMethod,
          amount: appointmentData.fee,
          currency: 'USD',
          status: 'completed',
          timestamp: new Date().toISOString(),
          ...(selectedPaymentMethod === 'card' && {
            cardLast4: cardDetails.cardNumber.slice(-4),
            cardType: getCardType(cardDetails.cardNumber)
          })
        };
        
        onPaymentSuccess(paymentData);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getCardType = (cardNumber) => {
    const num = cardNumber.replace(/\s/g, '');
    if (num.startsWith('4')) return 'Visa';
    if (num.startsWith('5') || num.startsWith('2')) return 'Mastercard';
    if (num.startsWith('3')) return 'American Express';
    return 'Unknown';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Payment</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Appointment Summary */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Appointment Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Doctor:</span>
              <span className="font-medium">Dr. {appointmentData.doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Speciality:</span>
              <span className="font-medium">{appointmentData.speciality}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date(appointmentData.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{appointmentData.time}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
              <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
              <span className="text-2xl font-bold text-green-600">${appointmentData.fee}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedPaymentMethod(method.id)}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedPaymentMethod === method.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg border">
                    {renderPaymentIcon(method)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{method.name}</h4>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    selectedPaymentMethod === method.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedPaymentMethod === method.id && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Card Details Form */}
          {selectedPaymentMethod === 'card' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-gray-800 mb-4">Card Details</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardDetails.expiryDate}
                      onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cvv}
                      onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.cvv ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardholderName}
                    onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                    placeholder="John Doe"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.cardholderName && (
                    <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onPaymentCancel}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={!selectedPaymentMethod || isProcessing}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedPaymentMethod && !isProcessing
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                `Pay $${appointmentData.fee}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
