import { HttpClient } from '../helpers'

function AuthService() {
	return {
		login: (values: any) => {
			return HttpClient.post('/auth/login', values)
		},
		logout() {
			return HttpClient.post('/logout', {})
		},
		register: (values: any) => {
			return HttpClient.post('/auth/register', values)
		},
		forgetPassword: (values: any) => {
			return HttpClient.post('/forget-password', values)
		},
		verifyOTP: (values: any) => {
			return HttpClient.post('/auth/verify', values)
		},
		resendOTP: (values: any) => {
			return HttpClient.post('/auth/resend', values)
		},
		addCustomerDetails: (values: any,  header: Record<string, string>) => {
			return HttpClient.post('/auth/customer/adddetails', values,  {headers: header })
		},
	}
}

export default AuthService()
