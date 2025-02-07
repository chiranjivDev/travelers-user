'use client';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';

export const CheckoutPage = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Make API call to create a payment intent and set client secret
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('/payment/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount, // Pass the amount
            senderId: 'user_123', // Replace with actual sender ID
            travelerId: 'user_456', // Replace with actual traveler ID
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
      }
    };
    fetchClientSecret();
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('submit');
    setLoading(true);

    if (!stripe || !elements) return;

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://localhost:3000/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    } else {
    }
    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return <p>Loading payment details...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {clientSecret && (
        <>
          <PaymentElement />
          <button
            type="submit"
            disabled={!stripe || loading}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold transition ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : `Pay $${amount}`}
          </button>
        </>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};
