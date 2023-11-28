import { authApi, useAuthContext } from '@/common'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { User } from '@/types'
import { Alert } from 'react-bootstrap'; 

export default function useLogin() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null);
	const location = useLocation()
	const navigate = useNavigate()
	

	const { isAuthenticated, saveSession } = useAuthContext()

	const redirectUrl = useMemo(
		() =>
			location.state && location.state.from
				? location.state.from.pathname
				: '/',
		[location.state]
	)

	const login = async ({ email, password }: User) => {
		setLoading(true);
		setError(null);
		
		try {
			console.log('dd')
			const res: any = await authApi.login({ email, password });
			console.log('Response:', res.status);
			console.log('hello')
			if (res.status) {
				const token = res.token;

				// Store the token in localStorage
				localStorage.setItem('token', token);
			  saveSession({ type: res.type, /* other user data */ });
			
			  navigate(redirectUrl);

			} else {
			  // Handle login failure
			  
			  setError('Incorrect username or password.'); // Set error message
			}
		  } catch (error) {
			console.error('Login error:', error);

				// Add conditions to customize error message based on error information
				if (error === 'Request failed with status code 401') {
				setError('Invalid credentials. Please check your username or password.');
				} else {
				setError('An error occurred during login.');
				}
		  } finally {
			setLoading(false);
		  }
		};

	return { loading, error, login, redirectUrl, isAuthenticated }
}
