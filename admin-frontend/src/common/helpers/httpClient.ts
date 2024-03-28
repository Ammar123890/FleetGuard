/* eslint-disable indent */
import axios from 'axios'

const ErrorCodeMessages: { [key: number]: string } = {
	401: 'Invalid credentials',
	403: 'Access Forbidden',
	404: 'Resource or page not found',
}

function HttpClient() {
	const _errorHandler = (error: any) =>
		Promise.reject(
			Object.keys(ErrorCodeMessages).includes(error?.response?.status)
				? ErrorCodeMessages[error.response.status]
				: error.response.data && error.response.data.message
				? error.response.data.message
				: error.message || error
		)

	const _httpClient = axios.create({
		// baseURL: "http://localhost:5000/api",
		baseURL: "https://fleetguard.azurewebsites.net/api",
		timeout: 6000,
		withCredentials: true,
		headers: {
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		},
	})

	_httpClient.interceptors.response.use((response) => {
		return response.data
	}, _errorHandler)

	return {
		get: (url: string, config = {}) => _httpClient.get(url, config),
		post: (url: string, data: any, config = {}) =>
			_httpClient.post(url, data, config),
		patch: (url: string, config = {}) => _httpClient.patch(url, config),
		put: (url: string, data:any, config = {}) => _httpClient.put(url, data, config),
		delete: (url: string, config = {}) => _httpClient.delete(url, config),
		client: _httpClient,
	}
}

export default HttpClient()
