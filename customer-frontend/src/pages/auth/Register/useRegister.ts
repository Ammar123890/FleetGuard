import { authApi, useAuthContext } from '@/common'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { User } from '@/types'
import React from 'react';

export default function useRegister() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null);
	const location = useLocation()
	const navigate = useNavigate()
  
	const { isAuthenticated, saveSession } = useAuthContext()
	console.log('hello')
	const redirectUrl = useMemo(
	  () =>
		location.state && location.state.from
		  ? location.state.from.pathname
		  : '/auth/verify-otp',
	  [location.state]
	)

	const register = async ({ email, password, userType }: User) => {
	  setLoading(true);
	  setError(null);
		console.log('register')
	  try {
		const res: any = await authApi.register({ email, password, userType });
		console.log('Response:', res.status);
		console.log(res.msg)
		if (res.status) {
		  const token = res.token;
  
		  // Store the token in localStorage
		  localStorage.setItem('token', token);
		  saveSession({ type: res.type, /* other user data */ });
		
		  navigate('/auth/verify-otp', { state: { email } });
		} else {
		  // Handle registration failure with server error message
		  setError(res.msg || 'Registration failed. Please check your information and try again.');
		}
	  } catch (error) {
		console.error('Registration error:', error);
  
		// Customize error message based on error information
		// if (error === 400) {
		//   setError('Invalid registration data. Please check your information.');
		// } else {
		//   setError('An error occurred during registration.');
		// }
	  } finally {
		setLoading(false);
	  }
	};
  
	return { loading, error, register, redirectUrl, isAuthenticated }
  }
  