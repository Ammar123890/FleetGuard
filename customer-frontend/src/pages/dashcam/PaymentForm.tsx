import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    // Handle payment using Stripe API
    const result = await stripe.confirmCardPayment('your-client-secret', {
      payment_method: {
        card: elements.getElement(CardElement) as any, // Adjust the type as needed
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else if (result.paymentIntent?.status === 'succeeded') {
      // Payment succeeded
      console.log('Payment succeeded!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default PaymentForm;
