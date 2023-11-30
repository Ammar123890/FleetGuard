import { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import useVerifyOTP from './VerifyOTP';
import { authApi } from '@/common';

const VerifyOTP = () => {
  const [error, setError] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState(location.state?.email || '');
  const { loading, onSubmit } = useVerifyOTP();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Call the onSubmit function from useVerifyOTP
      console.log('email:', email, ' otp:', otp);
      await onSubmit({ email, otp });
		
      // Redirect to another page after OTP verification, e.g., login page
     
    } catch (error) {
      // Handle error and set the error state
      console.error('Error during OTP verification:', error);
    }
  };

  const handleResendOTP = async () => {
    try {
      // Call the resend OTP API
      console.log('email', email);
      await authApi.resendOTP({ email });
      console.log('OTP resent successfully');
	  setSuccessMessage('OTP resent successfully!');
	  setError(null)
    } catch (error:any) {
		console.error('Error during OTP resend:', error);

		if (error.response) {
		  // The error has a response object
		  const { data } = error.response;
	
		  if (data.errors && data.errors.msg === 'OTP is not expired') {
			console.log('OTP is not expired, wait for the cooldown period');
			return;
		  }
		}
	
		// Handle other errors
		setError('Failed to resend OTP. Please try again.');
		setSuccessMessage(null);
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      {/* Display error message if available */}
      {error && <Alert variant="danger">{error}</Alert>} 
	  {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="otp">
          <Form.Label>Enter OTP</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the 4-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          Verify OTP
        </Button>
        <Button variant="link" onClick={handleResendOTP} disabled={loading}>
          Resend OTP
        </Button>
      </Form>
    </div>
  );
};

export default VerifyOTP;
