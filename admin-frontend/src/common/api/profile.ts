import { HttpClient } from '../helpers'

function ProfileService() {
	
	return {
		// profile: () => {
		// 	return HttpClient.get('/profile')
		// },
		addDevice: (model: string, pricePerMonth: number, price: number, quantity: number, description: string, headers: Record<string, string>) => {
			const values = { model, pricePerMonth, price, quantity, description };
			console.log('header of add device', headers)
			return HttpClient.post('/admin/dashcam/add', values, { headers});
		  },
		  viewDevice: ( headers: Record<string, string>) => {

			return HttpClient.get('/admin/dashcam/get', { headers});
		  },
		  getDeviceById: (value: string, header: Record<string, string>) => {
			console.log('header: ', header)
			console.log('value',)
			return HttpClient.get(`/admin/dashcam/get/${value}`,  {
				headers: header  // Correct way to include headers in the request
			  });;
		  },
		  editDevice: (value: string, model: string, pricePerMonth: number, price: number, quantity: number, description: string,  header: Record<string, string>) => {
			console.log('header: ', header)
			console.log('value',)
			const values = { model, pricePerMonth, price, quantity, description };
			return HttpClient.put(`/admin/dashcam/edit/${value}`, values, {
				headers: header 
			  });
		  },
		  getSalesData: (year: string, month: string, headers: Record<string, string>) => {
			console.log('year ', year)
			return HttpClient.get(`admin/sales/get?year=${year}&month=${month}`,  {headers});
		},
		deleteDevice: (value: any,  headers: Record<string, string> ) => {
			return HttpClient.delete(`admin/dashcam/delete/${value}`,  {headers});
		}
	}
}

export default ProfileService()
