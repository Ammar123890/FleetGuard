import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
console.log('hello')
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    // Handle payment using Stripe API
    const result = await stripe.confirmCardPayment('sk_test_51NGJaIF9Bg87hu380DY4iQrTQ5T9wB1OwpAVseh4g98W0trEhP8k3WM8TaNQxJx97np0AKv3hqqnoYavlcHrARbi00h1nb2joH', {
      payment_method: {
        card: elements.getElement(CardElement) as any, // Adjust the type as needed
      },
    });
console.log('hell')
    if (result.error) {
        console.log('vvf')
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
