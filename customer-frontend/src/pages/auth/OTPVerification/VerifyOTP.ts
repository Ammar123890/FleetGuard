// useVerifyOTP.js
import { useState } from 'react';
import { AxiosResponse } from 'axios';
import { authApi, useAuthContext } from '@/common';
import { User } from '@/types';
import { useNavigate } from 'react-router-dom'

// Define the type for the data parameter
interface VerifyOTPData {
  email: string;
  otp: string;
}

const useVerifyOTP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const navigate = useNavigate();
  const { saveSession } = useAuthContext()
  const onSubmit = async (data: VerifyOTPData) => {
 

    const { email, otp } = data;
    setLoading(true);

    try {
      const response: AxiosResponse<User> = await authApi.verifyOTP({ email, otp });
      // console.log(response.status); 
	  if(response){
      const token = response.data.token;
      console.log(response)
		  localStorage.setItem('token', token!);
		  saveSession({ type: response.data.type });
		console.log('tokennn', token)
		navigate('/auth/add-details')
	  }
    } catch (err) {
      setError( 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, onSubmit };
};

export default useVerifyOTP;
