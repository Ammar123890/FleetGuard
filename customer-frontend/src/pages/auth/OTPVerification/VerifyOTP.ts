// useVerifyOTP.js
import { useState } from 'react';
import { AxiosResponse } from 'axios';
import { authApi } from '@/common';
import { User } from '@/types';
import { useLocation, useNavigate } from 'react-router-dom'

// Define the type for the data parameter
interface VerifyOTPData {
  email: string;
  otp: string;
}

const useVerifyOTP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const navigate = useNavigate();
	console.log('here')
  // Explicitly specify the type for the data parameter
  const onSubmit = async (data: VerifyOTPData) => {
	
    const { email, otp } = data;
    setLoading(true);

    try {
      const response: AxiosResponse<User> = await authApi.verifyOTP({ email, otp });
      console.log(response.status); 
	  if(response.status){
		navigate('/')
	  }
    } catch (err) {
      // Handle error and set the error state
      setError( 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, onSubmit };
};

export default useVerifyOTP;
