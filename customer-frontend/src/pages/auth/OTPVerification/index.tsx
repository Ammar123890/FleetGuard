import { useState , useEffect} from 'react';
import { Button, Form, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import useVerifyOTP from './VerifyOTP';
import { authApi } from '@/common';

const VerifyOTP = () => {
  const [error, setError] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const location = useLocation();
  // const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState(location.state?.email || '');
  const { loading, onSubmit } = useVerifyOTP();
  const [timer, setTimer] = useState<number>(300);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [timer]);

  const resetTimer = () => {
    setTimer(300); // Reset the timer to 5 minutes
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('jjj')
    try {
      console.log('email:', email, ' otp:', otp);
   await onSubmit({ email, otp });
      resetTimer(); 
      // navigate('/auth/add-details')
  
    } catch (error) {
      console.error('Error during OTP verification:', error);
      setError('Failed to verify OTP. Please try again.');
      setSuccessMessage(null);
    }
  };

  const handleResendOTP = async () => {
    
    try {
      // Call the resend OTP API
      console.log('email', email);
      console.log(setEmail)
      const res = await authApi.resendOTP({ email });
      console.log('OTP resent successfully');
      
	  setSuccessMessage('OTP resent successfully!');
    resetTimer();
	  setError(null)
    if(!res){
      console.log(res)
    }
    } catch (error:any) {
		console.error('Error during OTP resend:', error);

		if (error.response) {
		  // The error has a response object
		  const { data } = error.response;
      
		  if (data.errors && data.errors.msg === 'OTP is not expired') {
			console.log('OTP is not expired, wait for the cooldown period');
      setError('OTP is not expired, wait for the cooldown period');
			return;
		  }
		}
		setError('Failed to resend OTP. Please try again.');
		setSuccessMessage(null);
    }
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header className="justify-content-center">
          <h2>Verify OTP</h2>
        </Card.Header>

        <Row className="justify-content-center">
          <Col md={6}>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {successMessage && <Alert variant="success">{successMessage}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="otp" className="mb-3"> {/* Added margin-bottom */}
                  <Form.Label>Enter OTP</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter the 4-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading} className="me-2">
                  Verify OTP
                </Button>

                <Button variant="outline-secondary" onClick={handleResendOTP} disabled={loading}>
                  Resend OTP {minutes > 0 && `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
                </Button>
              </Form>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}
export default VerifyOTP;
